import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Favorite from "@/models/Favorite";

const statuses = ["favorite", "watchlist", "watched"] as const;
type FavoriteStatus = (typeof statuses)[number];

function parseStatus(status: unknown): FavoriteStatus {
  return statuses.includes(status as FavoriteStatus)
    ? (status as FavoriteStatus)
    : "favorite";
}

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const favorites = await Favorite.find({ userId: user.id }).sort({ createdAt: -1 }).lean();

    return Response.json({ success: true, favorites });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not load favorites.", error: String(error) },
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
    const status = parseStatus(body.status);

    if (!movieId) {
      return Response.json({ success: false, message: "Movie id is required." }, { status: 400 });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { userId: user.id, movieId, status },
      { userId: user.id, movieId, status },
      { new: true, upsert: true, runValidators: true }
    );

    return Response.json({ success: true, favorite }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not save favorite.", error: String(error) },
      { status: 400 }
    );
  }
}
