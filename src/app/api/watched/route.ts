import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import User from "@/models/User";

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const { movieId, review } = await request.json();

    if (!movieId) {
      return Response.json({ success: false, message: "Movie id is required." }, { status: 400 });
    }

    const user = await User.findById(sessionUser.id);

    if (!user) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const movieIdString = String(movieId);
    const existing = user.watchedMovies.find(
      (movie: { movieId: string }) => movie.movieId === movieIdString
    );

    if (existing) {
      existing.review = String(review ?? "");
      existing.watchedAt = new Date();
    } else {
      user.watchedMovies.push({
        movieId: movieIdString,
        review: String(review ?? ""),
        watchedAt: new Date(),
      });
    }

    await user.save();

    return Response.json({ success: true, watchedMovies: user.watchedMovies });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not save watched movie.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const { movieId } = await request.json();
    const user = await User.findById(sessionUser.id);

    if (!user) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    user.watchedMovies = user.watchedMovies.filter(
      (movie: { movieId: string }) => movie.movieId !== String(movieId)
    );

    await user.save();

    return Response.json({ success: true, watchedMovies: user.watchedMovies });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not remove watched movie.", error: String(error) },
      { status: 500 }
    );
  }
}
