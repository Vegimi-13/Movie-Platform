import mongoose, { Schema } from "mongoose";

const FavoriteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["favorite", "watchlist", "watched"],
      default: "favorite",
    },
  },
  {
    timestamps: true,
  }
);

FavoriteSchema.index({ userId: 1, movieId: 1, status: 1 }, { unique: true });

const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

export default Favorite;
