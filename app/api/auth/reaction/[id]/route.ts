import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

// ================= TYPES =================
// These are the valid reaction types as stored in the database (lowercase)
type StoredReactionType = "like" | "heart" | "smile";
// Frontend uses uppercase; we'll convert internally
type ApiReactionType = "LIKE" | "HEART" | "SMILE";

// ================= API =================
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ---------- Get memory ID ----------
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid memory id" },
        { status: 400 }
      );
    }

    // ---------- Authentication ----------
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

    // ---------- Parse request body ----------
    let body: { type: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { type } = body;
    if (!type) {
      return NextResponse.json(
        { success: false, message: "Missing reaction type" },
        { status: 400 }
      );
    }

    // Convert to lowercase for validation and storage
    const normalizedType = type.toLowerCase();
    if (!["like", "heart", "smile"].includes(normalizedType)) {
      return NextResponse.json(
        { success: false, message: "Invalid reaction type" },
        { status: 400 }
      );
    }

    // ---------- Find memory ----------
    const memory = await UserMemory.findById(id);
    if (!memory) {
      return NextResponse.json(
        { success: false, message: "Memory not found" },
        { status: 404 }
      );
    }

    const userId = user._id.toString();

    // ---------- Clean any malformed reactions ----------
    memory.reactions = (memory.reactions || []).filter(
      (r) => r && r.userId
    );

    // ---------- Toggle reaction ----------
    const existingIndex = memory.reactions.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingIndex !== -1) {
      if (memory.reactions[existingIndex].type === normalizedType) {
        // Remove reaction
        memory.reactions.splice(existingIndex, 1);
      } else {
        // Change reaction type
        memory.reactions[existingIndex].type = normalizedType as StoredReactionType;
      }
    } else {
      // Add new reaction
      memory.reactions.push({
        userId: new mongoose.Types.ObjectId(user._id),
        type: normalizedType as StoredReactionType,
      });
    }

    await memory.save();

    // ---------- Build counts with uppercase keys ----------
    const counts = {
      LIKE: 0,
      HEART: 0,
      SMILE: 0,
    };

    memory.reactions.forEach((r) => {
      const key = r.type.toUpperCase() as ApiReactionType;
      counts[key]++;
    });

    // Find current user's reaction (return uppercase)
    const currentReaction = memory.reactions.find(
      (r) => r.userId.toString() === userId
    );
    const userReaction = currentReaction
      ? (currentReaction.type.toUpperCase() as ApiReactionType)
      : null;

    return NextResponse.json(
      {
        success: true,
        reactionCounts: counts,
        userReaction,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ toggleReaction Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}