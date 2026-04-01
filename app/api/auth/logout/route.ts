// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Create a response that clears the token cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the token cookie by setting it to an empty value and expiring it
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),      // immediately expire
      secure: true,              // send only over HTTPS
      sameSite: "none",          // allow cross-site requests if needed
      path: "/",                 // ensure cookie is cleared for all paths
    });

    return response;
  } catch (error: any) {
    console.error("❌ Logout Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}