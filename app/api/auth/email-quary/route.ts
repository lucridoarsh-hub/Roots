import { NextRequest, NextResponse } from "next/server";
import transporter from "@/app/_backend/libs/mailer";

/* ================= CLIENT QUERY EMAIL ================= */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // ✅ Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.EMAIL_USER;
    if (!adminEmail) {
      throw new Error("Admin email not configured in environment variables");
    }

    // ✅ Send Email to Admin
    await transporter.sendMail({
      from: `"Family Circle Support" <${adminEmail}>`, // Must be your Gmail
      to: 'ansariarsh325@gmail.com', // Admin receives query
      replyTo: email, // Client can reply directly
      subject: `New Client Query: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>📩 New Client Query Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="background:#f4f4f4; padding:10px; border-radius:5px;">${message}</p>
          <br />
          <p style="font-size:12px; color:gray;">This message was sent from your website contact form.</p>
        </div>
      `,
    });

    // ✅ Send Confirmation Email to Client
    await transporter.sendMail({
      from: `"Family Circle Support" <${adminEmail}>`, // Must be your Gmail
      to: email,
      subject: "We Received Your Query ✅",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${name} 👋</h2>
          <p>Thank you for contacting us.</p>
          <p>We have received your query regarding:</p>
          <p><strong>${subject}</strong></p>
          <p>Our team will get back to you shortly.</p>
          <br />
          <p>Best Regards,<br />Family Circle Team</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Query sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("clientQueryEmail error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}