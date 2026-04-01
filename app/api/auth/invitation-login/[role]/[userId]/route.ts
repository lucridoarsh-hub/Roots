import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "@/app/_backend/models/user.model";
import { connectDB } from "@/app/_backend/libs/db";
import { generateToken } from "@/app/_backend/libs/jwt";

/* ================= ROLE TYPE ================= */

type Role = "Viewer" | "Commenter" | "Contributor";

const allowedRoles: Role[] = ["Viewer", "Commenter", "Contributor"];

function isValidRole(role: string): role is Role {
  return allowedRoles.includes(role as Role);
}

/* ================= COOKIE ================= */

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

/* ================= LOGIN INVITED USER ================= */

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ role: string; userId: string }> } // ✅ Next.js 15 fix
) {
  try {
    await connectDB();

    /* ✅ unwrap params */
    const { role, userId } = await context.params;

    /* ✅ Validate params */
    if (!role || !userId) {
      return NextResponse.json(
        { success: false, message: "Role and userId are required" },
        { status: 400 }
      );
    }

    /* ✅ Validate role */
    if (!isValidRole(role)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    /* ✅ Validate ObjectId */
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    /* ✅ Check inviter exists */
    const inviterUser = await User.findById(userId);
    if (!inviterUser) {
      return NextResponse.json(
        { success: false, message: "Inviter user not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    /* ✅ Validate body */
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    /* ✅ Find user */
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ✅ Compare password */
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 400 }
      );
    }

    /* ✅ Prevent duplicate relation (user side) */
    const alreadyLinked = findUser.familyCircle.some(
      (member) => member.userId.toString() === userId
    );

    if (!alreadyLinked) {
      findUser.familyCircle.push({
        userId: new mongoose.Types.ObjectId(userId),
        role: "Viewer",
      });
      await findUser.save();
    }

    /* ✅ Prevent duplicate relation (inviter side) */
    const inviterAlreadyLinked = inviterUser.familyCircle.some(
      (member) =>
        member.userId.toString() === findUser._id.toString()
    );

    if (!inviterAlreadyLinked) {
      inviterUser.familyCircle.push({
        userId: findUser._id,
        role, // ✅ type-safe
      });
      await inviterUser.save();
    }

    /* ✅ Generate token */
    const token = generateToken(findUser._id.toString());

    /* ✅ Response + cookie */
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          _id: findUser._id,
          username: findUser.username,
          email: findUser.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error) {
    console.error("❌ loginInviteUser error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}