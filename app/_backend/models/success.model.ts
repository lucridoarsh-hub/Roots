import mongoose, {
  Schema,
  Document,
  Model,
  HydratedDocument
} from "mongoose";
import slugify from "slugify";

/* ================= TYPES ================= */

export interface ICloudinaryMedia {
  public_id: string;
  url: string;
}

export interface ISocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface IStats {
  photos: number;
  stories: number;
  members: number;
}

export interface ISuccessStory extends Document {
  name: string;
  slug: string;
  profession?: string;
  location: string;

  image: ICloudinaryMedia;
  avatar: ICloudinaryMedia;
  videoUrl?: string;

  quote: string;
  excerpt?: string;
  story: string;
  result: string;
  achievements: string[];

  socialLinks: ISocialLinks;
  stats: IStats;

  views: number;

  tags: string[];
  featured: boolean;
  isVerified: boolean;
  status: "draft" | "pending" | "published" | "rejected";
  order: number;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ================= SCHEMAS ================= */

const cloudinaryMediaSchema = new Schema<ICloudinaryMedia>(
  {
    public_id: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Invalid media URL"]
    }
  },
  { _id: false }
);

const successStorySchema = new Schema<ISuccessStory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    profession: {
      type: String,
      trim: true,
      default: ""
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: cloudinaryMediaSchema,
      required: true
    },

    avatar: {
      type: cloudinaryMediaSchema,
      required: true
    },

    videoUrl: {
      type: String,
      trim: true,
      default: "",
      match: [/^https?:\/\/.+/, "Invalid video URL"]
    },

    quote: {
      type: String,
      required: true,
      trim: true
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ""
    },

    story: {
      type: String,
      required: true,
      trim: true
    },

    result: {
      type: String,
      required: true,
      trim: true
    },

    achievements: {
      type: [String],
      default: []
    },

    socialLinks: {
      linkedin: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      website: { type: String, trim: true, default: "" }
    },

    stats: {
      photos: { type: Number, default: 0, min: 0 },
      stories: { type: Number, default: 0, min: 0 },
      members: { type: Number, default: 0, min: 0 }
    },

    views: {
      type: Number,
      default: 0,
      min: 0
    },

    tags: {
      type: [String],
      default: [],
      index: true
    },

    featured: {
      type: Boolean,
      default: false,
      index: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
      index: true
    },

    order: {
      type: Number,
      default: 0,
      index: true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

/* ================= AUTO SLUG (FIXED TS) ================= */

successStorySchema.pre<HydratedDocument<ISuccessStory>>(
  "validate",
  async function () {
    if (!this.slug && this.name) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true
      });
    }
  }
);

/* ================= INDEXES ================= */

successStorySchema.index({ featured: -1, order: 1 });
successStorySchema.index({ status: 1, isDeleted: 1 });

/* ================= MODEL (HOT RELOAD SAFE) ================= */

const SuccessStory: Model<ISuccessStory> =
  mongoose.models.SuccessStory ||
  mongoose.model<ISuccessStory>("SuccessStory", successStorySchema);

export default SuccessStory;