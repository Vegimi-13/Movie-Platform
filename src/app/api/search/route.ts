import { searchMovies } from "@/lib/omdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ success: false, message: "Query is required" }, { status: 400 });
  }

  try {
    const results = await searchMovies(query);
    return Response.json({ success: true, results });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
