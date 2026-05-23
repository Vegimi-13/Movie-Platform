import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
  name: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  collaboratorIds: mongoose.Types.ObjectId[];
  movieIds: string[];
  isPublic: boolean;
  inviteToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaboratorIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    movieIds: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    inviteToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
CollectionSchema.index({ userId: 1 });

const Collection =
  mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;
