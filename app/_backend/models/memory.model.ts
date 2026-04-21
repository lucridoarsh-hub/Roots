import mongoose, { Schema, Document, Model } from "mongoose";

/* ================= TYPES ================= */

export interface IImage {
  publicId: string;
  url: string;
  caption?: string;      // optional per‑image caption
  altText?: string;      // optional alt text for accessibility
  location?: string;     // optional location where this specific photo was taken
}

export interface IComment {
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReaction {
  userId: mongoose.Types.ObjectId;
  type: "like" | "heart" | "smile";
}

export interface IUserMemory extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  lifeStage:
    | "Early Years"
    | "School Years"
    | "College"
    | "Marriage & Relationships"
    | "Career"
    | "Retirement & Reflections";
  description: string;
  images: IImage[];
  date: Date;
  location?: string;          // optional memory location (e.g., "Paris, France")
  tags?: string[];            // optional array of tags (e.g., ["vacation", "family"])
  mood?: "happy" | "nostalgic" | "funny" | "sad" | "exciting"; // optional mood
  reactions: IReaction[];
  comments: IComment[];
  isPrivate: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ================= SCHEMAS ================= */

const imageSchema = new Schema<IImage>(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, required: false, trim: true, maxlength: 200 },
    altText: { type: String, required: false, trim: true, maxlength: 150 },
    location: { type: String, required: false, trim: true, maxlength: 200 },
  },
  { _id: false }
);

const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const reactionSchema = new Schema<IReaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "heart", "smile"], required: true },
  },
  { _id: false }
);

/* ================= MAIN SCHEMA ================= */

const userMemorySchema = new Schema<IUserMemory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    lifeStage: {
      type: String,
      enum: [
        "Early Years",
        "School Years",
        "College",
        "Marriage & Relationships",
        "Career",
        "Retirement & Reflections",
      ],
      default: "Early Years",
      required: true,
    },
    description: { type: String, required: false, trim: true, maxlength: 2000 },
    images: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: (val: IImage[]) => val.length <= 100,
        message: "Maximum 100 images allowed",
      },
    },
    date: { type: Date, default: Date.now },
    location: { type: String, trim: true, maxlength: 200 },
    tags: { type: [String], default: [], validate: (v: string[]) => v.length <= 20 },
    mood: {
      type: String,
      enum: ["happy", "nostalgic", "funny", "sad", "exciting"],
      required: false,
    },
    reactions: { type: [reactionSchema], default: [] },
    comments: { type: [commentSchema], default: [] },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */
userMemorySchema.index({ userId: 1, createdAt: -1 });
userMemorySchema.index({ userId: 1, date: -1 });

/* ================= MODEL (HOT RELOAD SAFE) ================= */
const UserMemory: Model<IUserMemory> =
  mongoose.models.UserMemory || mongoose.model<IUserMemory>("UserMemory", userMemorySchema);

export default UserMemory;