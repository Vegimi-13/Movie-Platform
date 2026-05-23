const OMDB_API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export async function searchMovies(query: string) {
  if (!OMDB_API_KEY) throw new Error("OMDB_API_KEY is not defined");
  
  const res = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
  const data = await res.json();
  
  if (data.Response === "False") {
    return [];
  }
  
  return data.Search;
}

export async function getMovieDetailsByImdbId(imdbId: string): Promise<OmdbMovie | null> {
  if (!OMDB_API_KEY) throw new Error("OMDB_API_KEY is not defined");
  
  const res = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`);
  const data = await res.json();
  
  if (data.Response === "False") {
    return null;
  }
  
  return data as OmdbMovie;
}

export function mapOmdbToMovieItem(omdb: OmdbMovie) {
  return {
    title: omdb.Title,
    description: omdb.Plot,
    genre: omdb.Genre.split(", ")[0], // Primary genre
    year: parseInt(omdb.Year),
    runtime: omdb.Runtime,
    director: omdb.Director,
    cast: omdb.Actors.split(", "),
    poster: omdb.Poster !== "N/A" ? omdb.Poster : "",
    backdrop: "", // OMDB doesn't provide backdrops
    trailerUrl: "", // OMDB doesn't provide trailers
    rating: parseFloat(omdb.imdbRating) || 0,
  };
}
