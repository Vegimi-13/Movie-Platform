import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Favorite from "@/models/Favorite";
import User from "@/models/User";

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const { movieId } = await request.json();

    if (!movieId) {
      return Response.json({ success: false, message: "Movie id is required." }, { status: 400 });
    }

    const user = await User.findById(sessionUser.id);

    if (!user) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const movieIdString = String(movieId);
    const alreadyLiked = user.likedMovieIds.includes(movieIdString);

    user.likedMovieIds = alreadyLiked
      ? user.likedMovieIds.filter((id: string) => id !== movieIdString)
      : [...user.likedMovieIds, movieIdString];

    await user.save();

    if (alreadyLiked) {
      await Favorite.findOneAndDelete({
        userId: sessionUser.id,
        movieId: movieIdString,
        status: "favorite",
      });
    } else {
      await Favorite.findOneAndUpdate(
        { userId: sessionUser.id, movieId: movieIdString, status: "favorite" },
        { userId: sessionUser.id, movieId: movieIdString, status: "favorite" },
        { upsert: true }
      );
    }

    return Response.json({
      success: true,
      liked: !alreadyLiked,
      likedMovieIds: user.likedMovieIds,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not update likes.", error: String(error) },
      { status: 500 }
    );
  }
}
