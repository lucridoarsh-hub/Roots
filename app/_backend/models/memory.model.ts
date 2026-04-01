import mongoose, { Schema, Document, Model } from "mongoose";

/* ================= TYPES ================= */

export interface IImage {
  publicId: string;
  url: string;
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
  reactions: IReaction[];
  comments: IComment[];
  isPrivate: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ================= SCHEMAS ================= */

const imageSchema = new Schema<IImage>(
  {
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const commentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

const reactionSchema = new Schema<IReaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["like", "heart", "smile"],
      required: true
    }
  },
  { _id: false }
);

/* ================= MAIN SCHEMA ================= */

const userMemorySchema = new Schema<IUserMemory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    lifeStage: {
      type: String,
      enum: [
        "Early Years",
        "School Years",
        "College",
        "Marriage & Relationships",
        "Career",
        "Retirement & Reflections"
      ],
      default: "Early Years",
      required: true
    },

    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 2000
    },

    images: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: (val: IImage[]) => val.length <= 100,
        message: "Maximum 100 images allowed"
      }
    },

    date: {
      type: Date,
      default: Date.now
    },

    reactions: {
      type: [reactionSchema],
      default: []
    },

    comments: {
      type: [commentSchema],
      default: []
    },

    isPrivate: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

userMemorySchema.index({ userId: 1, createdAt: -1 });
userMemorySchema.index({ userId: 1, date: -1 });

/* ================= MODEL (HOT RELOAD SAFE) ================= */

const UserMemory: Model<IUserMemory> =
  mongoose.models.UserMemory ||
  mongoose.model<IUserMemory>("UserMemory", userMemorySchema);

export default UserMemory;