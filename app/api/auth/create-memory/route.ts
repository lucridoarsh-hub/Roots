import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { cloudinary } from "../../../_backend/libs/cloudinary";
import { connectDB } from "../../../_backend/libs/db";
import { cookies } from "next/headers";

import User from "@/app/_backend/models/user.model"; // ✅ FIXED
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= CREATE MEMORY ================= */

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
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { id: string };
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

    const title = formData.get("title") as string;
    const lifeStage = formData.get("lifeStage") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;

    const isPrivateRaw = formData.get("isPrivate"); // 👈 FIX
    const isPrivate = isPrivateRaw === "true"; // ✅ DEFAULT false

    const files = formData.getAll("images") as File[];

    /* ================= VALIDATION ================= */

    if (!title || !lifeStage || !description || !date) {
      return NextResponse.json(
        {
          success: false,
          message: "title, lifeStage, description and date are required",
        },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Images are required" },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, message: "Max 10 images allowed" },
        { status: 400 }
      );
    }

    /* ================= UPLOAD IMAGES ================= */

    const images: { publicId: string; url: string }[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "memories" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      images.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    }

    /* ================= CREATE MEMORY ================= */

    const memory = await UserMemory.create({
      userId: new mongoose.Types.ObjectId(user._id),
      title,
      lifeStage,
      description,
      date: new Date(date),
      images,
      isPrivate, // ✅ FIXED (default false)
    });

    return NextResponse.json(
      {
        success: true,
        memory,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Create Memory Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}