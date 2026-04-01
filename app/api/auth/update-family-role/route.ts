import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import User from "@/app/_backend/models/user.model";
import { connectDB } from "@/app/_backend/libs/db";
import { getUserFromToken } from "@/app/_backend/libs/getUserFromToken";

/* ================= ROLE TYPE ================= */

type Role = "Viewer" | "Commenter" | "Contributor";

const validRoles: Role[] = ["Viewer", "Commenter", "Contributor"];

function isValidRole(role: string): role is Role {
  return validRoles.includes(role as Role);
}

/* ================= UPDATE FAMILY ROLE ================= */

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { memberId, role } = body;

    /* ✅ Validate input */
    if (!memberId || !role) {
      return NextResponse.json(
        { success: false, message: "memberId and role are required" },
        { status: 400 }
      );
    }

    /* ✅ Validate role */
    if (!isValidRole(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role type" },
        { status: 400 }
      );
    }

    /* ✅ Validate ObjectId */
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { success: false, message: "Invalid memberId" },
        { status: 400 }
      );
    }

    /* ✅ Owner */
    const owner = await User.findById(loggedInUser._id);

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Owner not found" },
        { status: 404 }
      );
    }

    /* ✅ Find member */
    const member = owner.familyCircle?.find(
      (m) => m.userId.toString() === memberId
    );

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Family member not found" },
        { status: 404 }
      );
    }

    /* ✅ Update role */
    member.role = role;

    await owner.save();

    return NextResponse.json(
      {
        success: true,
        message: "Family role updated successfully",
        data: owner.familyCircle,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ updateFamilyRole Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}