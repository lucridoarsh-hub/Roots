import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../_backend/models/user.model";
import { connectDB } from "../../../_backend/libs/db";
import { generateToken } from "../../../_backend/libs/jwt";
import { cookies } from "next/headers";

/* ================= LOGIN API ================= */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    /* ================= VALIDATION ================= */

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    /* ================= CHECK USER ================= */

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    /* ================= CHECK PASSWORD ================= */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    /* ================= GENERATE TOKEN ================= */

    const token = generateToken(user._id.toString());

    /* ================= SET COOKIE ================= */

    (await
          /* ================= SET COOKIE ================= */
          cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error"
      },
      { status: 500 }
    );
  }
}