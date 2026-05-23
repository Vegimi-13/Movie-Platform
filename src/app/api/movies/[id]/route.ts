import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/session";
import Movie from "@/models/Movie";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const movie = await Movie.findById(id).lean();

    if (!movie) {
      return Response.json({ success: false, message: "Movie not found." }, { status: 404 });
    }

    return Response.json({ success: true, movie });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not load movie.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return Response.json({ success: false, message: "Admin access required." }, { status: 403 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const movie = await Movie.findByIdAndUpdate(
      id,
      {
        ...body,
        cast: Array.isArray(body.cast)
          ? body.cast
          : String(body.cast ?? "")
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean),
        rating: Number(body.rating ?? 0),
        year: Number(body.year ?? new Date().getFullYear()),
        featured: Boolean(body.featured),
      },
      { new: true, runValidators: true }
    );

    if (!movie) {
      return Response.json({ success: false, message: "Movie not found." }, { status: 404 });
    }

    return Response.json({ success: true, movie });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not update movie.", error: String(error) },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return Response.json({ success: false, message: "Admin access required." }, { status: 403 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return Response.json({ success: false, message: "Movie not found." }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not delete movie.", error: String(error) },
      { status: 500 }
    );
  }
}
