import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import { searchMovies, getMovieDetailsByImdbId } from "@/lib/omdb";

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    return Response.json({ success: false, message: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const imdbId = searchParams.get("imdbId");

  try {
    if (imdbId) {
      const movie = await getMovieDetailsByImdbId(imdbId);
      return Response.json({ success: true, movie });
    }

    if (query) {
      const results = await searchMovies(query);
      return Response.json({ success: true, results });
    }

    return Response.json({ success: false, message: "Missing query or imdbId." }, { status: 400 });
  } catch (error) {
    return Response.json(
      { success: false, message: "OMDB request failed.", error: String(error) },
      { status: 500 }
    );
  }
}
