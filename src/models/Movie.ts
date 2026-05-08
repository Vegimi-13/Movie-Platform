import mongoose, { Schema } from "mongoose";

const MovieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Movie =
  mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

export default Movie;