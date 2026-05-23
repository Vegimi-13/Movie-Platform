import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Review from "@/models/Review";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  try {
    await connectDB();
    const query = movieId ? { movieId } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

    return Response.json({ success: true, reviews });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not load reviews.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const movieId = String(body.movieId ?? "");
    const rating = Number(body.rating ?? 0);
    const comment = String(body.comment ?? "").trim();

    if (!movieId || rating < 1 || rating > 10 || comment.length < 5) {
      return Response.json(
        { success: false, message: "Movie, rating, and a 5 character review are required." },
        { status: 400 }
      );
    }

    const review = await Review.findOneAndUpdate(
      { userId: user.id, movieId },
      {
        userId: user.id,
        userName: user.name,
        movieId,
        rating,
        comment,
      },
      { new: true, runValidators: true, upsert: true }
    );

    return Response.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not save review.", error: String(error) },
      { status: 400 }
    );
  }
}
