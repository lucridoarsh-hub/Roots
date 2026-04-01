import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectDB } from "@/app/_backend/libs/db";
import User from "@/app/_backend/models/user.model";

/* ================= FETCH ALL USERS (Admin Only) ================= */
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

    /* ================= FETCH USERS ================= */
    const users = await User.find()
      .select("-password") // remove password
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error: any) {
    console.error("❌ Fetch Users Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}