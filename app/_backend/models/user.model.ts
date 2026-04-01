import mongoose, { Schema, Document, Model } from "mongoose";

/* -------------------- TYPES -------------------- */

export interface IFamilyCircle {
  userId: mongoose.Types.ObjectId;
  role: "Viewer" | "Commenter" | "Contributor";
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;

  profileImage: {
    public_id: string;
    url: string;
  };

  familyCircle: IFamilyCircle[];

  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  createdAt: Date;
  updatedAt: Date;
}

/* -------------------- SCHEMA -------------------- */

const familyCircleSchema = new Schema<IFamilyCircle>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["Viewer", "Commenter", "Contributor"],
      default: "Viewer"
    }
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    profileImage: {
      public_id: {
        type: String,
        default: ""
      },
      url: {
        type: String,
        default: ""
      }
    },

    familyCircle: [familyCircleSchema],

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

/* -------------------- MODEL (IMPORTANT FIX) -------------------- */
// Prevent model overwrite in Next.js hot reload

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;