import { NextRequest, NextResponse } from "next/server";
import User from "@/app/_backend/models/user.model";
import { connectDB } from "@/app/_backend/libs/db";
import transporter from "@/app/_backend/libs/mailer";

/* ================= ROLE TYPE ================= */

type Role = "Viewer" | "Commenter" | "Contributor";

const validRoles: Role[] = ["Viewer", "Commenter", "Contributor"];

function isValidRole(role: string): role is Role {
  return validRoles.includes(role as Role);
}

/* ================= GET USER FROM TOKEN ================= */
/* 🔥 Replace with your actual auth logic */
import { getUserFromToken } from "@/app/_backend/libs/getUserFromToken";

/* ================= API ================= */

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /* ✅ Get logged-in user */
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { email, role } = body;

    /* ✅ Validate input */
    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email and role are required" },
        { status: 400 }
      );
    }

    /* ✅ Validate role */
    if (!isValidRole(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    const familyOwnerId = user._id.toString();

    /* ✅ Generate links */
    const registerInviteLink = `${process.env.FRONTEND_URL}/register/${role}/${familyOwnerId}`;
    const loginInviteLink = `${process.env.FRONTEND_URL}/login/${role}/${familyOwnerId}`;

    /* ✅ Check if user already exists */
    const findUser = await User.findOne({ email });

    const inviteLink = findUser ? loginInviteLink : registerInviteLink;

    /* ✅ Send Email */
    await transporter.sendMail({
      from: `"Family Circle" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're Invited to Join My Family Circle 🎉",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello 👋</h2>
          <p>You have been invited to join my <strong>Family Circle</strong> as <strong>${role}</strong>.</p>
          <p>Click below to continue:</p>
          
          <a href="${inviteLink}" 
             style="
               display: inline-block;
               padding: 12px 20px;
               background-color: #4285F4;
               color: white;
               text-decoration: none;
               border-radius: 6px;
               font-weight: bold;">
             ${findUser ? "Login & Join" : "Register & Join"}
          </a>

          <p style="margin-top: 20px; font-size: 12px; color: gray;">
            If you didn’t expect this invitation, ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invitation sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ InviteUser error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}