import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/_backend/libs/db";
import { cookies } from "next/headers";
import { cloudinary } from "@/app/_backend/libs/cloudinary";

import User from "@/app/_backend/models/user.model";
import { Blog } from "@/app/_backend/models/blog.model";

/* ================= GET SINGLE BLOG (Public) ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(id)
      .populate("userId", "name avatar")
      .lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error("❌ Fetch Single Blog Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE BLOG (Admin Only) ================= */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      );
    }

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
        { success: false, message: "Forbidden: Only admin can update blogs" },
        { status: 403 }
      );
    }

    // Find blog (no ownership check because admin can edit any)
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    /* ================= FORM DATA ================= */
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const tagsRaw = formData.get("tags") as string | null;

    const imagesToDeleteRaw = formData.get("imagesToDelete") as string | null;
    const newFiles = formData.getAll("newImages") as File[];

    /* ================= TAGS ================= */
    let formattedTags: string[] | undefined;
    if (tagsRaw !== null) {
      formattedTags = tagsRaw.split(",").map((tag) => tag.trim());
    }

    /* ================= UPDATE IMAGES ================= */
    let updatedImages = blog.images;

    if (imagesToDeleteRaw) {
      const publicIdsToDelete = imagesToDeleteRaw.split(",").map((id) => id.trim());
      for (const publicId of publicIdsToDelete) {
        await cloudinary.uploader.destroy(publicId);
        updatedImages = updatedImages.filter((img) => img.public_id !== publicId);
      }
    }

    if (newFiles.length > 0) {
      if (newFiles.length + updatedImages.length > 10) {
        return NextResponse.json(
          { success: false, message: "Maximum 10 images allowed after update" },
          { status: 400 }
        );
      }

      for (const file of newFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "blogs" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(buffer);
        });
        updatedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    /* ================= UPDATE BLOG ================= */
    const updateData: any = {};
    if (title !== null) updateData.title = title;
    if (description !== null) updateData.description = description;
    if (formattedTags !== undefined) updateData.tags = formattedTags;
    if (updatedImages !== blog.images) updateData.images = updatedImages;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
    });
  } catch (error: any) {
    console.error("❌ Update Blog Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

/* ================= DELETE BLOG (Admin Only) ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      );
    }

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
        { success: false, message: "Forbidden: Only admin can delete blogs" },
        { status: 403 }
      );
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    for (const image of blog.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Delete Blog Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}