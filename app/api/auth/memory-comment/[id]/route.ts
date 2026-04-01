import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= ADD COMMENT ================= */

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIXED
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

    const memoryId = id;
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

    /* ================= BODY ================= */

    const body = await req.json();
    const { comment } = body;

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment is required" },
        { status: 400 }
      );
    }

    /* ================= MEMORY ================= */

    const memory = await UserMemory.findById(memoryId);

    if (!memory) {
      return NextResponse.json(
        { success: false, message: "Memory not found" },
        { status: 404 }
      );
    }

    const ownerId = memory.userId;
    const currentUserId = currentUser._id;

    /* ================= OWNER CAN COMMENT ================= */

    if (ownerId.toString() === currentUserId.toString()) {
      memory.comments.push({
        userId: currentUserId,
        text: comment.trim(),
      });

      await memory.save();

      return NextResponse.json(
        {
          success: true,
          message: "Comment added successfully",
        },
        { status: 200 }
      );
    }

    /* ================= ROLE CHECK ================= */

    const owner = await User.findOne({
      _id: ownerId,
      familyCircle: {
        $elemMatch: {
          userId: currentUserId,
          role: { $ne: "Viewer" }, // ❌ Viewer cannot comment
        },
      },
    });

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Not allowed to comment" },
        { status: 403 }
      );
    }

    /* ================= ADD COMMENT ================= */

    memory.comments.push({
      userId: currentUserId,
      text: comment.trim(),
    });

    await memory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ DoCommitFamilyCircleMemory Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}