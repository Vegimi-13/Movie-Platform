import { SlidersHorizontal } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MovieGrid from "@/components/movies/MovieGrid";
import { getMovies } from "@/lib/movies";
import GlobalSearch from "@/components/movies/GlobalSearch";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams?: Promise<{ genre?: string; q?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const movies = await getMovies();
  const genres = [...new Set(movies.map((movie) => movie.genre))].sort();
  const selectedGenre = params.genre ?? "All";
  
  const filteredMovies = movies.filter((movie) => {
    return selectedGenre === "All" || movie.genre === selectedGenre;
  });

  return (
    <>
      <Header />
      <main className="shell py-12">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
              Library
            </p>
            <h1 className="mt-2 text-4xl font-black">Movie collection</h1>
            <p className="mt-3 max-w-2xl text-[#a7adba]">
              Discover millions of movies via OMDB or browse our curated MongoDB catalog below.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-auto md:items-end">
            <GlobalSearch />
            <form className="glass flex w-full items-center gap-2 rounded-lg p-2 md:w-[300px]">
              <select
                className="h-10 flex-1 rounded-md border border-white/10 bg-[#171b24] px-3 text-sm outline-none"
                defaultValue={selectedGenre}
                name="genre"
              >
                <option>All Genres</option>
                {genres.map((genre) => (
                  <option key={genre}>{genre}</option>
                ))}
              </select>
              <button className="h-10 rounded-md bg-[#f5b84b] px-4 text-xs font-bold text-[#08090d]" type="submit">
                Filter
              </button>
            </form>
          </div>
        </div>

        <section>
          <h2 className="mb-6 text-xl font-black flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5b84b]" />
            Local Collection ({filteredMovies.length})
          </h2>
          {filteredMovies.length ? (
            <MovieGrid movies={filteredMovies} />
          ) : (
            <div className="glass rounded-lg p-10 text-center">
              <h2 className="text-2xl font-black">No movies found in this genre</h2>
              <p className="mt-2 text-[#a7adba]">Try another genre filter.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
