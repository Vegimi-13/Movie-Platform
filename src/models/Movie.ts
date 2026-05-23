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

    year: {
      type: Number,
      default: new Date().getFullYear(),
    },

    runtime: {
      type: String,
      default: "2h 00m",
    },

    director: {
      type: String,
      default: "Unknown",
    },

    cast: {
      type: [String],
      default: [],
    },

    poster: {
      type: String,
      required: true,
    },

    backdrop: {
      type: String,
      default: "",
    },

    trailerUrl: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Movie =
  mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

export default Movie;
