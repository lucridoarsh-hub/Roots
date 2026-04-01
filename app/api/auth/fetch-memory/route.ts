import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= FETCH MEMORIES ================= */

export async function GET(req: NextRequest) {
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

    /* ================= USER ================= */

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= FETCH MEMORIES ================= */

    const memories = await UserMemory.find({
      userId: user._id,
    })
      .populate([
        { path: "userId", select: "username profileImage" },
        { path: "reactions.userId", select: "username profileImage" },
        { path: "comments.userId", select: "username profileImage" },
      ])
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: memories.length,
        memories,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ fetchMemories Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}