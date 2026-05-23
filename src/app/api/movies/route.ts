import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/session";
import Movie from "@/models/Movie";

export async function GET() {
  try {
    await connectDB();
    const movies = await Movie.find().sort({ createdAt: -1 }).lean();

    return Response.json({ success: true, movies });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not load movies.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return Response.json({ success: false, message: "Admin access required." }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const movie = await Movie.create({
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
    });

    return Response.json({ success: true, movie }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not save movie.", error: String(error) },
      { status: 400 }
    );
  }
}
