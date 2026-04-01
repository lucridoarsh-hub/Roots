import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= TYPES ================= */

type ReactionType = "like" | "heart" | "smile";

/* ================= API ================= */

export async function POST(
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

    /* ================= BODY ================= */

    const body = await req.json();
    const { type } = body as { type: ReactionType };

    if (!["like", "heart", "smile"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid reaction type" },
        { status: 400 }
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

    const userId = user._id.toString();

    /* ================= CLEAN INVALID ================= */

    memory.reactions = (memory.reactions || []).filter(
      (r) => r && r.userId
    );

    /* ================= TOGGLE ================= */

    const existingIndex = memory.reactions.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingIndex !== -1) {
      if (memory.reactions[existingIndex].type === type) {
        // remove reaction
        memory.reactions.splice(existingIndex, 1);
      } else {
        // update reaction
        memory.reactions[existingIndex].type = type;
      }
    } else {
      // add reaction
      memory.reactions.push({
        userId: new mongoose.Types.ObjectId(user._id),
        type,
      });
    }

    await memory.save();

    /* ================= COUNTS ================= */

    const counts: Record<ReactionType, number> = {
      like: 0,
      heart: 0,
      smile: 0,
    };

    memory.reactions.forEach((r) => {
      if (counts[r.type] !== undefined) {
        counts[r.type]++;
      }
    });

    const userReaction =
      memory.reactions.find(
        (r) => r.userId.toString() === userId
      )?.type || null;

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