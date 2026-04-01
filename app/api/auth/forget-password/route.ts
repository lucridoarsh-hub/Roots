import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "../../../_backend/models/user.model";
import { connectDB } from "../../../_backend/libs/db";
import transporter from "../../../_backend/libs/mailer";

/* ================= FORGOT PASSWORD API ================= */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email } = body;

    /* ================= VALIDATION ================= */
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    /* ================= CHECK USER ================= */
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= GENERATE RESET TOKEN ================= */
    // 🔐 Generate plain reset token (for URL)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and store in DB (security best practice)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.save();

    /* ================= CREATE RESET URL ================= */
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    /* ================= SEND EMAIL ================= */
    await transporter.sendMail({
      from: `"Enduring Roots" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🔑 Password Reset Request – Enduring Roots",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#2c3e50;">Password Reset</h2>
          <p>Hello ${user.username},</p>

          <p>You requested a password reset for your Enduring Roots account.</p>

          <p>
            Click the button below to reset your password.<br>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <a href="${resetUrl}"
             style="background:#2c3e50;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;font-weight:600;">
             Reset Password
          </a>

          <p style="margin-top:25px;font-size:13px;color:gray;">
            If you did not request this, please ignore this email. Your account is safe.
          </p>

          <p style="margin-top:20px;">
            — Team Enduring Roots 🌳
          </p>
        </div>
      `,
    });

    /* ================= RESPONSE ================= */
    return NextResponse.json(
      {
        success: true,
        message: "Password reset email sent",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Forgot Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}