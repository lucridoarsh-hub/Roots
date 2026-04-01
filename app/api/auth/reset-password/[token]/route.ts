import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../../../../_backend/models/user.model";
import { connectDB } from "../../../../_backend/libs/db";

/* ================= RESET PASSWORD API ================= */

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }   // ← Fixed for Next.js 15+
) {
  try {
    await connectDB();

    // ✅ Must await params in Next.js 15+ (dynamic route segments are now Promises)
    const { token } = await params;

    const body = await req.json();
    const { password } = body;

    /* ================= VALIDATION ================= */
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    /* ================= HASH TOKEN & FIND USER ================= */
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    /* ================= HASH NEW PASSWORD ================= */
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    /* ================= CLEAR RESET FIELDS ================= */
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    /* ================= RESPONSE ================= */
    return NextResponse.json(
      {
        success: true,
        message: "Password reset successful",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Reset Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}