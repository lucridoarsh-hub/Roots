import { connectDB } from "../../_backend/libs/db";
import { NextResponse } from "next/server";

/* ================= GET API ================= */

export async function GET() {
    connectDB()
  return NextResponse.json({
    success: true,
    message: "Demo API is working 🚀",
    data: {
      name: "Arsh",
      stack: "Next.js + TypeScript + Mongoose"
    }
  });
}

/* ================= POST API ================= */

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    success: true,
    message: "Data received successfully",
    receivedData: body
  });
}