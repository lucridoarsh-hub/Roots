import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";
import { cloudinary } from "@/app/_backend/libs/cloudinary";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= TYPES ================= */

type LifeStageType =
  | "Early Years"
  | "School Years"
  | "College"
  | "Marriage & Relationships"
  | "Career"
  | "Retirement & Reflections";

/* ================= UPDATE MEMORY ================= */

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Next.js 15
) {
  try {
    await connectDB();

    /* ================= PARAM ================= */
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid memory ID" },
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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= MEMORY ================= */

    const memory = await UserMemory.findById(id);

    if (!memory) {
      return NextResponse.json(
        { success: false, message: "Memory not found" },
        { status: 404 }
      );
    }

    const ownerId = memory.userId;
    const currentUserId = currentUser._id;

    /* ================= PERMISSION ================= */

    let isAllowed = false;

    if (ownerId.toString() === currentUserId.toString()) {
      isAllowed = true;
    } else {
      const owner = await User.findById(ownerId).select("familyCircle");

      const member = owner?.familyCircle?.find((m) =>
        m.userId.toString() === currentUserId.toString()
      );

      if (member && member.role === "Contributor") {
        isAllowed = true;
      }
    }

    if (!isAllowed) {
      return NextResponse.json(
        { success: false, message: "Not allowed to edit memory" },
        { status: 403 }
      );
    }

    /* ================= CONTENT TYPE ================= */

    const contentType = req.headers.get("content-type") || "";

    let body: any = {};
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      body = {
        title: formData.get("title"),
        lifeStage: formData.get("lifeStage"),
        description: formData.get("description"),
        date: formData.get("date"),
        isPrivate: formData.get("isPrivate"),
        removedImages: formData.get("removedImages"),
      };

      files = formData.getAll("images") as File[];
    } else {
      body = await req.json();
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

    /* ================= UPDATE FIELDS ================= */

    if (body.title !== undefined) memory.title = body.title;

    if (body.lifeStage !== undefined) {
      if (!validLifeStages.includes(body.lifeStage)) {
        return NextResponse.json(
          { success: false, message: "Invalid lifeStage" },
          { status: 400 }
        );
      }
      memory.lifeStage = body.lifeStage;
    }

    if (body.description !== undefined)
      memory.description = body.description;

    if (body.date !== undefined)
      memory.date = new Date(body.date);

    if (body.isPrivate !== undefined) {
      memory.isPrivate =
        body.isPrivate === true || body.isPrivate === "true";
    }

    /* ================= DELETE IMAGES ================= */

    if (body.removedImages) {
      const removedImages =
        typeof body.removedImages === "string"
          ? JSON.parse(body.removedImages)
          : body.removedImages;

      await Promise.all(
        removedImages.map(async (publicId: string) => {
          await cloudinary.uploader.destroy(publicId);

          memory.images = memory.images.filter(
            (img) => img.publicId !== publicId
          );
        })
      );
    }

    /* ================= UPLOAD IMAGES ================= */

    if (files.length > 0) {
      if (memory.images.length + files.length > 10) {
        return NextResponse.json(
          { success: false, message: "Max 10 images allowed" },
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

    return NextResponse.json(
      {
        success: true,
        message: "Memory updated successfully",
        memory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ updateFamilyCircleMemory Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}