import type { MovieItem } from "@/lib/demoMovies";
import MovieCard from "@/components/ui/MovieCard";

export default function MovieGrid({ movies }: { movies: MovieItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
}
