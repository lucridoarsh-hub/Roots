import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../_backend/models/user.model";
import { connectDB } from "../../../_backend/libs/db";
import { generateToken } from "../../../_backend/libs/jwt";
import { cookies } from "next/headers";
import transporter from "../../../_backend/libs/mailer";

/* ================= REGISTER API ================= */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { username, email, password } = body;

    /* ================= VALIDATION ================= */

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    /* ================= CHECK USER ================= */

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    /* ================= HASH PASSWORD ================= */

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* ================= CREATE USER ================= */

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    /* ================= TOKEN ================= */

    const token = generateToken(user._id.toString());

    // Set cookie (Next.js way)
    (await
      // Set cookie (Next.js way)
      cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    });

    /* ================= SEND EMAIL ================= */

    await transporter.sendMail({
      from: `"Enduring Roots" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🌳 Welcome to Enduring Roots – Preserve Your Legacy",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color:#2c3e50;">🌿 Enduring Roots</h1>
          <h2>Welcome ${username}!</h2>

          <p>Every memory tells a <strong>beautiful story</strong>.</p>

          <p>
            Enduring Roots is your digital sanctuary for preserving your life’s journey.
          </p>

          <a href="${process.env.FRONTEND_URL}/dashboard"
             style="background:#2c3e50; color:white; padding:10px 18px; text-decoration:none; border-radius:5px;">
             Go to Dashboard
          </a>

          <p style="margin-top:20px;">
            — Team Enduring Roots 🌳
          </p>
        </div>
      `
    });

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Register Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error"
      },
      { status: 500 }
    );
  }
}