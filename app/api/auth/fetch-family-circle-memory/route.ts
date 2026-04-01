import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";

import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

/* ================= FETCH ONLY FAMILY MEMORIES ================= */

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

    const user = await User.findById(decoded.id).select("familyCircle");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= GET ONLY FAMILY IDS ================= */

    const familyIds =
      user.familyCircle?.map((member) => member.userId) || [];

    if (familyIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          count: 0,
          data: [],
        },
        { status: 200 }
      );
    }

    /* ================= FETCH ONLY FAMILY PUBLIC MEMORIES ================= */

    const memories = await UserMemory.find({
      userId: { $in: familyIds },   // ❌ removed self
      isPrivate: false,             // ❌ only public memories
    })
      .populate("userId", "username profileImage")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: memories.length,
        data: memories,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ fetchFamilyCircleMemory Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}