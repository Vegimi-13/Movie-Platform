import { Clapperboard, Film, Star, Tags } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getMovies } from "@/lib/movies";
import { requireAdmin } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/login");
  }

  const movies = await getMovies();
  const genres = [...new Set(movies.map((movie) => movie.genre))];
  const best = [...movies].sort((a, b) => b.rating - a.rating)[0];

  return (
    <>
      <Header />
      <main className="shell py-12">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
            Overview
          </p>
          <h1 className="mt-2 text-4xl font-black">Platform dashboard</h1>
          <p className="mt-3 max-w-2xl text-[#a7adba]">
            A quick read on your movie catalog and what is currently performing best.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={<Film size={22} />} label="Movies" value={movies.length.toString()} />
          <Stat icon={<Tags size={22} />} label="Genres" value={genres.length.toString()} />
          <Stat icon={<Star size={22} />} label="Top rating" value={best.rating.toFixed(1)} />
          <Stat icon={<Clapperboard size={22} />} label="Featured" value={movies.filter((movie) => movie.featured).length.toString()} />
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass rounded-lg p-6">
            <h2 className="text-2xl font-black">Highest rated</h2>
            <div className="mt-5 space-y-3">
              {[...movies]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 6)
                .map((movie, index) => (
                  <div key={movie._id} className="flex items-center gap-4 rounded-lg bg-white/5 p-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f5b84b] font-black text-[#08090d]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{movie.title}</p>
                      <p className="text-sm text-[#a7adba]">{movie.genre} · {movie.year}</p>
                    </div>
                    <p className="font-bold text-[#f5b84b]">{movie.rating.toFixed(1)}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="glass rounded-lg p-6">
            <h2 className="text-2xl font-black">Genres</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span key={genre} className="rounded-md border border-white/10 px-3 py-2 text-sm text-[#d7d9de]">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-[#f5b84b]">
        {icon}
      </div>
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm text-[#a7adba]">{label}</p>
    </div>
  );
}
