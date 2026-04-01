import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";
import { cloudinary } from "@/app/_backend/libs/cloudinary";

import User from "@/app/_backend/models/user.model";
import { Blog } from "@/app/_backend/models/blog.model";

/* ================= GET ALL BLOGS ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const tag = searchParams.get("tag");

    const filter: any = {};
    if (tag) filter.tags = tag;

    const blogs = await Blog.find(filter)
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(filter);

    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("❌ Fetch Blogs Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

/* ================= CREATE BLOG (Admin Only) ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /* ================= AUTH ================= */
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    } catch {
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

    // Admin check
    if (user.email !== "tarunkhannain@gmail.com") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Only admin can create blogs" },
        { status: 403 }
      );
    }

    /* ================= FORM DATA ================= */
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const tagsRaw = formData.get("tags");
    const files = formData.getAll("images") as File[];

    /* ================= VALIDATION ================= */
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Images are required" },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, message: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    /* ================= TAGS FORMAT ================= */
    let formattedTags: string[] = [];
    if (tagsRaw) {
      if (typeof tagsRaw === "string") {
        formattedTags = tagsRaw.split(",").map((tag) => tag.trim());
      } else {
        formattedTags = [String(tagsRaw)];
      }
    }

    /* ================= UPLOAD IMAGES ================= */
    const images: { public_id: string; url: string }[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blogs" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    /* ================= CREATE BLOG ================= */
    const blog = await Blog.create({
      userId: new mongoose.Types.ObjectId(user._id),
      title,
      description,
      images,
      tags: formattedTags,
    });

    return NextResponse.json(
      { success: true, blog },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Create Blog Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}