import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAIL } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  likedMovieIds: string[];
  watchedMovies: WatchedMovie[];
};

export type WatchedMovie = {
  movieId: string;
  review: string;
  watchedAt: string;
};

function toSessionUser(user: {
  _id: unknown;
  name: string;
  email: string;
  role?: "user" | "admin";
  likedMovieIds?: string[];
  watchedMovies?: Array<{
    movieId: unknown;
    review?: unknown;
    watchedAt?: unknown;
  }>;
}): SessionUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.email.toLowerCase() === ADMIN_EMAIL && user.role === "admin" ? "admin" : "user",
    likedMovieIds: user.likedMovieIds ?? [],
    watchedMovies: (user.watchedMovies ?? []).map((movie) => ({
      movieId: String(movie.movieId),
      review: String(movie.review ?? ""),
      watchedAt:
        movie.watchedAt instanceof Date
          ? movie.watchedAt.toISOString()
          : String(movie.watchedAt ?? new Date().toISOString()),
    })),
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  try {
    await connectDB();
    const user = await User.findById(userId).lean();

    return user ? toSessionUser(user as Parameters<typeof toSessionUser>[0]) : null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSessionUser();

  return user?.role === "admin" && user.email.toLowerCase() === ADMIN_EMAIL ? user : null;
}
