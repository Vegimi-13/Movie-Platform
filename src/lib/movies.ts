import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { demoMovies, type MovieItem } from "@/lib/demoMovies";
import Movie from "@/models/Movie";
import { getMovieDetailsByImdbId, mapOmdbToMovieItem } from "@/lib/omdb";

function normalizeMovie(movie: Record<string, unknown>): MovieItem {
  return {
    _id: String(movie._id),
    title: String(movie.title ?? ""),
    description: String(movie.description ?? ""),
    genre: String(movie.genre ?? "Drama"),
    year: Number(movie.year ?? new Date().getFullYear()),
    runtime: String(movie.runtime ?? "2h 00m"),
    director: String(movie.director ?? "Unknown"),
    cast: Array.isArray(movie.cast) ? movie.cast.map(String) : [],
    poster: String(movie.poster ?? ""),
    backdrop: String(movie.backdrop ?? movie.poster ?? ""),
    trailerUrl: String(movie.trailerUrl ?? ""),
    rating: Number(movie.rating ?? 0),
    featured: Boolean(movie.featured),
  };
}

export async function getMovies(): Promise<MovieItem[]> {
  try {
    await connectDB();
    const movies = await Movie.find().sort({ featured: -1, rating: -1 }).lean();

    if (!movies.length) {
      return demoMovies;
    }

    return movies.map((movie) => normalizeMovie(movie as Record<string, unknown>));
  } catch {
    return demoMovies;
  }
}

export async function getMovieById(id: string): Promise<MovieItem | null> {
  // 1. Try MongoDB (only if it's a valid ObjectId)
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      await connectDB();
      const movie = await Movie.findById(id).lean();
      if (movie) {
        return normalizeMovie(movie as Record<string, unknown>);
      }
    } catch (error) {
      console.error("MongoDB fetch failed", error);
    }
  }

  // 2. Try OMDB if the ID looks like an IMDB ID (starts with tt)
  if (id.startsWith("tt")) {
    try {
      const omdbMovie = await getMovieDetailsByImdbId(id);
      if (omdbMovie) {
        return {
          ...mapOmdbToMovieItem(omdbMovie),
          _id: id,
        } as MovieItem;
      }
    } catch (error) {
      console.error("OMDB fetch failed", error);
    }
  }

  // 3. Try Demo Movies
  const demoMovie = demoMovies.find((movie) => movie._id === id);
  return demoMovie ?? null;
}

export async function getMoviesByIds(ids: string[]): Promise<MovieItem[]> {
  if (!ids.length) return [];
  
  const objectIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
  const otherIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
  
  let normalizedInDb: MovieItem[] = [];

  try {
    if (objectIds.length > 0) {
      await connectDB();
      const moviesInDb = await Movie.find({ _id: { $in: objectIds } }).lean();
      normalizedInDb = moviesInDb.map((movie) => normalizeMovie(movie as Record<string, unknown>));
    }

    const foundInDbIds = normalizedInDb.map(m => m._id);
    const missingIds = [...otherIds, ...objectIds.filter(id => !foundInDbIds.includes(id))];

    // Fetch missing from OMDB or Demo
    const otherMovies = await Promise.all(
      missingIds.map(async (id) => {
        // Try OMDB
        if (id.startsWith("tt")) {
          const omdb = await getMovieDetailsByImdbId(id);
          if (omdb) return { ...mapOmdbToMovieItem(omdb), _id: id } as MovieItem;
        }
        // Try Demo
        return demoMovies.find(m => m._id === id) || null;
      })
    );

    const allFound = [...normalizedInDb, ...otherMovies.filter((m): m is MovieItem => !!m)];

    // Maintain original order
    return ids
      .map(id => allFound.find(m => m._id === id))
      .filter((m): m is MovieItem => !!m);
  } catch (error) {
    console.error("Batch fetch error", error);
    return demoMovies.filter(m => ids.includes(m._id));
  }
}
