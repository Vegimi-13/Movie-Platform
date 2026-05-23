import type { GetServerSideProps } from "next";
import Link from "next/link";
import { getMovies } from "@/lib/movies";
import type { MovieItem } from "@/lib/demoMovies";

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
}> = async () => {
  const movies = await getMovies();

  return {
    props: {
      movies,
    },
  };
};

export default function SsrMoviesPage({ movies }: { movies: MovieItem[] }) {
  return (
    <main className="shell py-12">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
        SSR example
      </p>
      <h1 className="mt-2 text-4xl font-black">Server-rendered movie list</h1>
      <p className="mt-3 text-[#a7adba]">
        This page exists to demonstrate getServerSideProps for the project
        requirements.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {movies.slice(0, 6).map((movie) => (
          <Link
            className="glass rounded-lg p-4 hover:border-[#f5b84b]/60"
            href={`/public/movies/${movie._id}`}
            key={movie._id}
          >
            <h2 className="font-black">{movie.title}</h2>
            <p className="mt-2 text-sm text-[#a7adba]">
              {movie.genre} · {movie.year}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
