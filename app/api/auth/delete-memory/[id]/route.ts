import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";
import { cloudinary } from "@/app/_backend/libs/cloudinary";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= DELETE MEMORY ================= */

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Next.js 15
) {
  try {
    await connectDB();

    /* ================= PARAM ================= */
    const { id } = await context.params;

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

    /* ================= MEMORY ================= */

    const memory = await UserMemory.findById(id);

    if (!memory) {
      return NextResponse.json(
        { success: false, message: "Memory not found" },
        { status: 404 }
      );
    }

    if (memory.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    /* ================= DELETE IMAGES ================= */

    if (memory.images && memory.images.length > 0) {
      await Promise.all(
        memory.images.map(async (img) => {
          if (img.publicId) {
            await cloudinary.uploader.destroy(img.publicId);
          }
        })
      );
    }

    /* ================= DELETE MEMORY ================= */

    await memory.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: "Memory deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ deleteMemory Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}