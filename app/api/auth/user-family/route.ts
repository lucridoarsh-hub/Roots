import { NextRequest, NextResponse } from "next/server";

import User from "@/app/_backend/models/user.model";
import { connectDB } from "@/app/_backend/libs/db";
import { getUserFromToken } from "@/app/_backend/libs/getUserFromToken";

/* ================= GET FAMILY CIRCLE ================= */

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    /* ✅ Auth */
    const loggedInUser = await getUserFromToken(req);

    if (!loggedInUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ✅ Fetch family circle */
    const user = await User.findById(loggedInUser._id)
      .select("familyCircle")
      .populate(
        "familyCircle.userId",
        "username email profileImage"
      );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

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
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}