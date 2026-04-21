// app/api/client-query/route.ts (or wherever your route file is located)
import { NextRequest, NextResponse } from "next/server";
import transporter from "@/app/_backend/libs/mailer";

// Brand colours – keep consistent with your landing page theme
const brand = {
  primary: "#2C4A2E",        // deep green
  primaryLight: "#3d6640",
  accent: "#F59E0B",         // amber/gold
  bgLight: "#FCFBF8",
  textDark: "#1A2E1A",
  textMuted: "#4A6741",
  border: "#E6DFD3",
};

// Public URL of your logo – adjust to your actual domain or use an environment variable
const LOGO_URL = "https://www.enduringroots.in/logo.png";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
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

    const currentYear = new Date().getFullYear();

    // ---------- 1. Admin Notification Email ----------
    const adminHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Client Query</title>
        </head>
        <body style="margin:0; padding:0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${brand.bgLight}; color: ${brand.textDark};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${brand.bgLight}; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); border: 1px solid ${brand.border}; overflow: hidden;">
                  <!-- Header with logo -->
                  <tr>
                    <td style="padding: 32px 32px 16px; text-align: center; border-bottom: 1px solid ${brand.border};">
                      <img src="${LOGO_URL}" alt="Enduring Roots" style="height: 50px; width: auto; max-width: 180px;" />
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 32px;">
                      <div style="display: inline-block; background-color: ${brand.primary}10; padding: 6px 16px; border-radius: 40px; border: 1px solid ${brand.primary}30; margin-bottom: 24px;">
                        <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.5px; color: ${brand.primary}; text-transform: uppercase;">📬 New Client Message</span>
                      </div>
                      
                      <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 700; margin: 0 0 24px; color: ${brand.primary}; line-height: 1.3;">
                        Someone wants to connect
                      </h2>
                      
                      <table width="100%" style="margin-bottom: 24px; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid ${brand.border};"><strong style="color: ${brand.textDark};">Name:</strong></td>
                          <td style="padding: 8px 0; border-bottom: 1px solid ${brand.border};">${name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid ${brand.border};"><strong style="color: ${brand.textDark};">Email:</strong></td>
                          <td style="padding: 8px 0; border-bottom: 1px solid ${brand.border};"><a href="mailto:${email}" style="color: ${brand.primary}; text-decoration: none; border-bottom: 1px dotted ${brand.primary};">${email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid ${brand.border};"><strong style="color: ${brand.textDark};">Subject:</strong></td>
                          <td style="padding: 8px 0; border-bottom: 1px solid ${brand.border};">${subject}</td>
                        </tr>
                      </table>
                      
                      <div style="background-color: ${brand.bgLight}; padding: 20px; border-radius: 16px; border-left: 4px solid ${brand.accent}; margin-bottom: 32px;">
                        <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: ${brand.textMuted};">Message:</p>
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: ${brand.textDark};">${message.replace(/\n/g, '<br>')}</p>
                      </div>
                      
                      <div style="text-align: center;">
                        <a href="mailto:${email}" style="display: inline-block; background-color: ${brand.primary}; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 40px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px ${brand.primary}40;">Reply to ${name.split(' ')[0]}</a>
                      </div>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; background-color: ${brand.bgLight}; border-top: 1px solid ${brand.border}; text-align: center;">
                      <p style="margin: 0 0 8px; font-size: 13px; color: ${brand.textMuted};">
                        This message was sent from the Enduring Roots contact form.
                      </p>
                      <p style="margin: 0; font-size: 13px; color: ${brand.textMuted};">
                        © ${currentYear} Enduring Roots · Preserve what matters
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // ---------- 2. Client Confirmation Email ----------
    const clientHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>We received your message</title>
        </head>
        <body style="margin:0; padding:0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${brand.bgLight}; color: ${brand.textDark};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${brand.bgLight}; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); border: 1px solid ${brand.border}; overflow: hidden;">
                  <!-- Header with logo -->
                  <tr>
                    <td style="padding: 32px 32px 16px; text-align: center;">
                      <img src="${LOGO_URL}" alt="Enduring Roots" style="height: 50px; width: auto; max-width: 180px;" />
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 32px 32px;">
                      <div style="text-align: center; margin-bottom: 24px;">
                        <div style="background-color: ${brand.accent}20; width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                          <span style="font-size: 32px;">✅</span>
                        </div>
                        <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 700; margin: 0 0 8px; color: ${brand.primary};">Thank you, ${name.split(' ')[0]}</h2>
                        <p style="font-size: 16px; color: ${brand.textMuted}; margin: 0;">Your message has been received.</p>
                      </div>
                      
                      <div style="background-color: ${brand.bgLight}; padding: 24px; border-radius: 20px; margin-bottom: 32px;">
                        <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.5; color: ${brand.textDark};">We've got your query regarding:</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 600; color: ${brand.primary}; padding-bottom: 12px; border-bottom: 1px dashed ${brand.border};">"${subject}"</p>
                        <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.6; color: ${brand.textDark};">A member of our team will review your message and respond within <strong>24–48 hours</strong>. We look forward to helping you preserve your legacy.</p>
                      </div>
                      
                      <div style="text-align: center; margin-bottom: 32px;">
                        <a href="https://www.enduringroots.in" style="display: inline-block; background-color: ${brand.primary}; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 40px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px ${brand.primary}40;">Visit Enduring Roots</a>
                      </div>
                      
                      <hr style="border: 0; border-top: 1px solid ${brand.border}; margin: 24px 0;" />
                      
                      <p style="font-size: 14px; color: ${brand.textMuted}; margin: 0 0 16px;">In the meantime, you might enjoy:</p>
                      <table width="100%">
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="display: inline-block; width: 6px; height: 6px; background-color: ${brand.accent}; border-radius: 50%; margin-right: 10px;"></span>
                            <a href="https://www.enduringroots.in/blog" style="color: ${brand.primary}; text-decoration: none; font-weight: 500;">Read our latest stories →</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="display: inline-block; width: 6px; height: 6px; background-color: ${brand.accent}; border-radius: 50%; margin-right: 10px;"></span>
                            <a href="https://www.enduringroots.in/success-stories" style="color: ${brand.primary}; text-decoration: none; font-weight: 500;">See how families preserve their legacy →</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; background-color: ${brand.bgLight}; border-top: 1px solid ${brand.border}; text-align: center;">
                      <p style="margin: 0 0 8px; font-size: 13px; color: ${brand.textMuted};">
                        Enduring Roots · Where memories become a legacy
                      </p>
                      <p style="margin: 0; font-size: 13px; color: ${brand.textMuted};">
                        © ${currentYear} Enduring Roots. All rights reserved.
                      </p>
                      <p style="margin: 12px 0 0; font-size: 12px; color: ${brand.textMuted};">
                        <a href="https://www.enduringroots.in/privacy" style="color: ${brand.textMuted};">Privacy</a> · 
                        <a href="https://www.enduringroots.in/terms" style="color: ${brand.textMuted};">Terms</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send both emails
    await Promise.all([
      transporter.sendMail({
        from: `"Enduring Roots Support" <${adminEmail}>`,
        to: "support@enduringroots.in",
        replyTo: email,
        subject: `New Query: ${subject}`,
        html: adminHtml,
      }),
      transporter.sendMail({
        from: `"Enduring Roots" <${adminEmail}>`,
        to: email,
        subject: "We've received your message | Enduring Roots",
        html: clientHtml,
      }),
    ]);

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