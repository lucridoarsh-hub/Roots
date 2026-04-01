import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";

import User from "@/app/_backend/models/user.model";

/* ================= FETCH FAMILY CIRCLE ================= */

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

    /* ================= USER ================= */

    const user = await User.findById(decoded.id)
      .select("familyCircle")
      .populate("familyCircle.userId", "username email profileImage");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        success: true,
        count: user.familyCircle?.length || 0,
        data: user.familyCircle || [],
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ fetchFamilyCircle Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}