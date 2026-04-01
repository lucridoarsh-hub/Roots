import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectDB } from "@/app/_backend/libs/db";
import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= FETCH ALL MEMORIES (Admin Only) ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

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

    const admin = await User.findById(decoded.id);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= ADMIN CHECK ================= */
    if (admin.email !== "tarunkhannain@gmail.com") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    /* ================= FETCH MEMORIES ================= */
    const memories = await UserMemory.find()
      .populate("userId", "username email profileImage")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: memories.length,
      memories,
    });

  } catch (error: any) {
    console.error("❌ Fetch Memories Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}