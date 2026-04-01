import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/user.model";
import { connectDB } from "./db";

/* ================= TOKEN TYPE ================= */

interface TokenPayload {
  id: string;
}

/* ================= FUNCTION ================= */

export const getUserFromToken = async (req: NextRequest) => {
  try {
    await connectDB();

    /* ✅ Get token from cookies */
    const token = req.cookies.get("token")?.value;
    console.log(token)
    if (!token) {
      return null;
    }

    /* ✅ Verify token */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;
    console.log(decoded)

    if (!decoded?.id) {
      return null;
    }

    /* ✅ Validate ObjectId */
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return null;
    }

    /* ✅ Fetch user */
    const user = await User.findById(decoded.id).select("-password");
    console.log(user)
    if (!user) {
      return null;
    }

    return user;

  } catch (error) {
    console.error("❌ getUserFromToken error:", error);
    return null;
  }
};