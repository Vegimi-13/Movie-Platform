import { connectDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";

export async function GET() {
  try {
    await connectDB();

    const movies = await Movie.find();

    return Response.json({
      success: true,
      movies,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}