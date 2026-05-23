import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { getMovieById, getMovies } from "@/lib/movies";
import type { MovieItem } from "@/lib/demoMovies";

export const getStaticPaths: GetStaticPaths = async () => {
  const movies = await getMovies();

  return {
    paths: movies.slice(0, 8).map((movie) => ({
      params: { id: movie._id },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<{
  movie: MovieItem;
}> = async ({ params }) => {
  const movie = await getMovieById(String(params?.id ?? ""));

  if (!movie) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      movie,
    },
    revalidate: 60,
  };
};

export default function IsrMoviePage({ movie }: { movie: MovieItem }) {
  return (
    <main className="shell py-12">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
        ISR example
      </p>
      <h1 className="mt-2 text-4xl font-black">{movie.title}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-[#d7d9de]">
        {movie.description}
      </p>
      <div className="mt-6 flex gap-3 text-sm text-[#a7adba]">
        <span>{movie.genre}</span>
        <span>{movie.year}</span>
        <span>{movie.rating.toFixed(1)}</span>
      </div>
      <Link
        className="mt-8 inline-flex rounded-lg bg-[#f5b84b] px-5 py-3 font-bold text-[#08090d]"
        href={`/public/movies/${movie._id}`}
      >
        Open App Router details
      </Link>
    </main>
  );
}
