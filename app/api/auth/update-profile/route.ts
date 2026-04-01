import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cloudinary } from "../../../_backend/libs/cloudinary";  // ← import from lib
import User from "../../../_backend/models/user.model";
import { connectDB } from "../../../_backend/libs/db";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    // Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const username = formData.get("username") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const profileImageFile = formData.get("profileImage") as File | null;

    let updated = false;

    // Update text fields
    if (username) {
      user.username = username;
      updated = true;
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 400 }
        );
      }
      user.email = email;
      updated = true;
    }

    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
      updated = true;
    }

    // Profile image upload
    if (profileImageFile) {
      // Delete old image if exists
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      // Upload new image from buffer
      const arrayBuffer = await profileImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profiles",
              width: 300,
              crop: "scale",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      user.profileImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      updated = true;
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "No fields provided to update" },
        { status: 400 }
      );
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Update User Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}