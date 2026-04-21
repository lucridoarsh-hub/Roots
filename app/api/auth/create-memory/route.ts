import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cloudinary } from "@/app/_backend/libs/cloudinary";
import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";
import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /* ================= AUTH ================= */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= FORM DATA ================= */
    const formData = await req.formData();

    // Required fields
    const title = formData.get("title") as string;
    const lifeStage = formData.get("lifeStage") as string;
    const date = formData.get("date") as string;
    const isPrivate = formData.get("isPrivate") === "true";

    // Optional memory fields
    const description = (formData.get("description") as string) || "";
    const location = (formData.get("location") as string) || undefined;
    const mood = (formData.get("mood") as string) || undefined;
    const tagsRaw = formData.get("tags") as string | null;
    let tags: string[] = [];
    if (tagsRaw) {
      try {
        tags = JSON.parse(tagsRaw);
        if (!Array.isArray(tags)) tags = [];
        tags = tags.slice(0, 20); // limit to 20 tags
      } catch {
        tags = [];
      }
    }

    // Images
    const files = formData.getAll("images") as File[];
    if (!files.length) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }
    if (files.length > 10) {
      return NextResponse.json(
        { success: false, message: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    // Per‑image optional arrays (each as JSON stringified array)
    const captionsRaw = formData.get("captions") as string | null;   // e.g. '["cap1","cap2"]'
    const altTextsRaw = formData.get("altTexts") as string | null;   // e.g. '["alt1","alt2"]'
    const imageLocationsRaw = formData.get("imageLocations") as string | null;

    let captions: string[] = [];
    let altTexts: string[] = [];
    let imageLocations: string[] = [];

    try {
      if (captionsRaw) captions = JSON.parse(captionsRaw);
      if (altTextsRaw) altTexts = JSON.parse(altTextsRaw);
      if (imageLocationsRaw) imageLocations = JSON.parse(imageLocationsRaw);
    } catch {
      // ignore malformed JSON – leave empty arrays
    }

    // Ensure arrays have the same length as files (fill missing with empty strings)
    const padArray = <T>(arr: T[], length: number, defaultValue: T): T[] => {
      const padded = [...arr];
      while (padded.length < length) padded.push(defaultValue);
      return padded.slice(0, length);
    };

    const paddedCaptions = padArray(captions, files.length, "");
    const paddedAltTexts = padArray(altTexts, files.length, "");
    const paddedImageLocations = padArray(imageLocations, files.length, "");

    /* ================= VALIDATION ================= */
    if (!title || !lifeStage || !date) {
      return NextResponse.json(
        { success: false, message: "title, lifeStage and date are required" },
        { status: 400 }
      );
    }

    const allowedLifeStages = [
      "Early Years",
      "School Years",
      "College",
      "Marriage & Relationships",
      "Career",
      "Retirement & Reflections",
    ];
    if (!allowedLifeStages.includes(lifeStage)) {
      return NextResponse.json(
        { success: false, message: "Invalid lifeStage value" },
        { status: 400 }
      );
    }

    if (mood && !["happy", "nostalgic", "funny", "sad", "exciting"].includes(mood)) {
      return NextResponse.json(
        { success: false, message: "Invalid mood value" },
        { status: 400 }
      );
    }

    /* ================= UPLOAD IMAGES ================= */
    const images: { publicId: string; url: string; caption?: string; altText?: string; location?: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "memories" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      const imageData: any = {
        publicId: result.public_id,
        url: result.secure_url,
      };

      if (paddedCaptions[i]) imageData.caption = paddedCaptions[i].trim();
      if (paddedAltTexts[i]) imageData.altText = paddedAltTexts[i].trim();
      if (paddedImageLocations[i]) imageData.location = paddedImageLocations[i].trim();

      images.push(imageData);
    }

    /* ================= CREATE MEMORY ================= */
    const memoryData: any = {
      userId: new mongoose.Types.ObjectId(user._id),
      title: title.trim(),
      lifeStage,
      description: description.trim(),
      date: new Date(date),
      images,
      isPrivate,
    };

    if (location) memoryData.location = location.trim();
    if (mood) memoryData.mood = mood;
    if (tags.length) memoryData.tags = tags.map(t => t.trim()).slice(0, 20);

    const memory = await UserMemory.create(memoryData);

    return NextResponse.json(
      { success: true, memory },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Create Memory Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}