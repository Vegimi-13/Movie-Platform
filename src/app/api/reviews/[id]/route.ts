import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Review from "@/models/Review";

function canModify(review: { userId: unknown }, user: { id: string; role: string }) {
  return String(review.userId) === user.id || user.role === "admin";
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
    const current = await Review.findById(id);

    if (!current) {
      return Response.json({ success: false, message: "Review not found." }, { status: 404 });
    }

    if (!canModify(current, user)) {
      return Response.json({ success: false, message: "Not allowed." }, { status: 403 });
    }

    const body = await request.json();
    current.rating = Number(body.rating ?? current.rating);
    current.comment = String(body.comment ?? current.comment).trim();
    await current.save();

    return Response.json({ success: true, review: current });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not update review.", error: String(error) },
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
    const current = await Review.findById(id);

    if (!current) {
      return Response.json({ success: false, message: "Review not found." }, { status: 404 });
    }

    if (!canModify(current, user)) {
      return Response.json({ success: false, message: "Not allowed." }, { status: 403 });
    }

    await current.deleteOne();

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not delete review.", error: String(error) },
      { status: 500 }
    );
  }
}
