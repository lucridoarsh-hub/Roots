import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";
import { cloudinary } from "@/app/_backend/libs/cloudinary";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

type LifeStageType =
  | "Early Years"
  | "School Years"
  | "College"
  | "Marriage & Relationships"
  | "Career"
  | "Retirement & Reflections";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is Promise
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIXED

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid memory id" },
        { status: 400 }
      );
    }

    /* ================= AUTH ================= */

  const token = (await cookies()).get("token")?.value;

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
        { success: false, message: "Invalid or Expired Token" },
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

    const memory = await UserMemory.findById(id);

    if (!memory) {
      return NextResponse.json(
        { success: false, message: "Memory not found" },
        { status: 404 }
      );
    }

    if (memory.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized (Not Owner)" },
        { status: 403 }
      );
    }

    /* ================= HANDLE INPUT ================= */

    const contentType = req.headers.get("content-type") || "";

    let title: string | null = null;
    let lifeStageRaw: string | null = null;
    let description: string | null = null;
    let date: string | null = null;
    let isPrivateRaw: any = null;
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      title = formData.get("title") as string | null;
      lifeStageRaw = formData.get("lifeStage") as string | null;
      description = formData.get("description") as string | null;
      date = formData.get("date") as string | null;
      isPrivateRaw = formData.get("isPrivate");

      files = formData.getAll("images") as File[];
    } else {
      const body = await req.json();

      title = body.title || null;
      lifeStageRaw = body.lifeStage || null;
      description = body.description || null;
      date = body.date || null;
      isPrivateRaw = body.isPrivate;
    }

    /* ================= VALIDATION ================= */

    const validLifeStages: LifeStageType[] = [
      "Early Years",
      "School Years",
      "College",
      "Marriage & Relationships",
      "Career",
      "Retirement & Reflections",
    ];

    /* ================= UPDATE ================= */

    if (title) memory.title = title;

    if (lifeStageRaw) {
      if (!validLifeStages.includes(lifeStageRaw as LifeStageType)) {
        return NextResponse.json(
          { success: false, message: "Invalid lifeStage value" },
          { status: 400 }
        );
      }
      memory.lifeStage = lifeStageRaw as LifeStageType;
    }

    if (description) memory.description = description;
    if (date) memory.date = new Date(date);

    if (isPrivateRaw !== null && isPrivateRaw !== undefined) {
      memory.isPrivate =
        isPrivateRaw === true || isPrivateRaw === "true";
    }

    /* ================= IMAGE UPLOAD ================= */

    if (files.length > 0) {
      const totalImages = memory.images.length + files.length;

      if (totalImages > 100) {
        return NextResponse.json(
          { success: false, message: "Max 100 images allowed" },
          { status: 400 }
        );
      }

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

        memory.images.push({
          publicId: result.public_id,
          url: result.secure_url,
        });
      }
    }

    await memory.save();

    return NextResponse.json({
      success: true,
      message: "Memory updated successfully",
      memory,
    });

  } catch (error: any) {
    console.error("❌ editMemory Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}