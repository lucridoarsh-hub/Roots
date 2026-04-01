import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../../../../../_backend/models/user.model";
import { connectDB } from "../../../../../_backend/libs/db";
import { generateToken } from "../../../../../_backend/libs/jwt";

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

/* ================= API ================= */

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ role: string; userId: string }> } // 👈 IMPORTANT CHANGE
) {
  try {
    await connectDB();

    /* ✅ FIX: await params */
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

    const body = await req.json();
    const { username, email, password } = body;

    /* ✅ Validate body */
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email and password are required",
        },
        { status: 400 }
      );
    }

    /* ✅ Check email exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
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

    /* ✅ Hash password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ✅ Create invited user */
    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      familyCircle: [
        {
          userId,
          role: "Viewer",
        },
      ],
    });

    /* ✅ Add invited user to inviter */
    inviterUser.familyCircle.push({
      userId: savedUser._id,
      role, // ✅ fully type safe
    });

    await inviterUser.save();

    /* ✅ Generate token */
    const token = generateToken(savedUser._id.toString());

    /* ✅ Response */
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error) {
    console.error("❌ registerInviteUser error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}