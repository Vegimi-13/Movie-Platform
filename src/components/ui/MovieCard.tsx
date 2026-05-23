import { Clock, Star } from "lucide-react";
import Link from "next/link";
import type { MovieItem } from "@/lib/demoMovies";

export default function MovieCard({ movie }: { movie: MovieItem }) {
  return (
    <Link
      className="group block overflow-hidden rounded-lg border border-white/10 bg-[#10131a] transition duration-200 hover:-translate-y-1 hover:border-[#f5b84b]/60"
      href={`/public/movies/${movie._id}`}
    >
      <div className="aspect-[2/3] overflow-hidden bg-[#171b24]">
        <img
          alt={`${movie.title} poster`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={movie.poster}
        />
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-bold">{movie.title}</h3>
          <p className="mt-1 text-sm text-[#a7adba]">
            {movie.genre} · {movie.year}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-[#f5b84b]">
            <Star size={16} fill="currentColor" />
            {movie.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1 text-[#a7adba]">
            <Clock size={15} />
            {movie.runtime}
          </span>
        </div>
      </div>
    </Link>
  );
}
