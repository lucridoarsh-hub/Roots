import mongoose, {
  Schema,
  Model,
  HydratedDocument
} from "mongoose";

/* ================= TYPES ================= */

export interface IBlogImage {
  public_id: string;
  url: string;
}

export interface IBlog {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: IBlogImage[];
  tags: string[];

  createdAt: Date;
  updatedAt: Date;
}

/* ================= MODEL TYPE ================= */

type BlogDocument = HydratedDocument<IBlog>;
type BlogModel = Model<IBlog>;

/* ================= SCHEMA ================= */

const blogSchema = new Schema<IBlog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
          trim: true
        },
        url: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],

    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

/* ================= MODEL (HOT RELOAD SAFE) ================= */

export const Blog: BlogModel =
  (mongoose.models.Blog as BlogModel) ||
  mongoose.model<IBlog>("Blog", blogSchema);