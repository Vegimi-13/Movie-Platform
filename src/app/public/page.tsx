import { ArrowRight, Play, Star } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MovieGrid from "@/components/movies/MovieGrid";
import { getMovies } from "@/lib/movies";

export default async function PublicHome() {
  const movies = await getMovies();
  const featured = movies.find((movie) => movie.featured) ?? movies[0];
  const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const genres = [...new Set(movies.map((movie) => movie.genre))].slice(0, 6);

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            src={featured.backdrop || featured.poster}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/78 to-[#08090d]/30" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08090d] to-transparent" />
          <div className="shell relative z-10 flex min-h-[calc(100vh-4rem)] items-center py-16">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-[#d9dce3]">
                <span className="rounded-md bg-[#f5b84b] px-3 py-1 font-bold text-[#08090d]">
                  Featured
                </span>
                <span>{featured.genre}</span>
                <span>{featured.year}</span>
                <span className="flex items-center gap-1 text-[#f5b84b]">
                  <Star size={16} fill="currentColor" />
                  {featured.rating.toFixed(1)}
                </span>
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-[1.02] sm:text-7xl">
                {featured.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d7d9de]">
                {featured.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="flex h-12 items-center gap-2 rounded-lg bg-[#f5b84b] px-5 font-bold text-[#08090d] hover:bg-white"
                  href={`/public/movies/${featured._id}`}
                >
                  <Play size={18} fill="currentColor" />
                  Watch details
                </Link>
                <Link
                  className="flex h-12 items-center gap-2 rounded-lg border border-white/15 px-5 font-bold text-white hover:bg-white/10"
                  href="/public/movies"
                >
                  Browse library
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="shell -mt-16 pb-16">
          <div className="glass grid gap-4 rounded-lg p-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-5">
              <p className="text-3xl font-black">{movies.length}</p>
              <p className="mt-1 text-sm text-[#a7adba]">Movies ready to explore</p>
            </div>
            <div className="rounded-lg bg-white/5 p-5">
              <p className="text-3xl font-black">{genres.length}</p>
              <p className="mt-1 text-sm text-[#a7adba]">Genres in the library</p>
            </div>
            <div className="rounded-lg bg-white/5 p-5">
              <p className="text-3xl font-black">
                {(movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length).toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-[#a7adba]">Average audience score</p>
            </div>
          </div>
        </section>

        <section className="shell pb-20">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
                Top rated
              </p>
              <h2 className="mt-2 text-3xl font-black">Tonight&apos;s best picks</h2>
            </div>
            <Link className="hidden text-sm font-bold text-[#4fb0c6] hover:text-white sm:block" href="/public/movies">
              View all movies
            </Link>
          </div>
          <MovieGrid movies={topRated} />
        </section>
      </main>
      <Footer />
    </>
  );
}
