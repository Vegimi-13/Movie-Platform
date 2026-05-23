import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Favorite from "@/models/Favorite";

const statuses = ["favorite", "watchlist", "watched"] as const;

function parseStatus(status: unknown) {
  return statuses.includes(status as (typeof statuses)[number])
    ? status
    : "favorite";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const favorite = await Favorite.findOneAndUpdate(
      { _id: id, userId: user.id },
      { status: parseStatus(body.status) },
      { new: true, runValidators: true }
    );

    if (!favorite) {
      return Response.json({ success: false, message: "Favorite not found." }, { status: 404 });
    }

    return Response.json({ success: true, favorite });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not update favorite.", error: String(error) },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const favorite = await Favorite.findOneAndDelete({ _id: id, userId: user.id });

    if (!favorite) {
      return Response.json({ success: false, message: "Favorite not found." }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not delete favorite.", error: String(error) },
      { status: 500 }
    );
  }
}
