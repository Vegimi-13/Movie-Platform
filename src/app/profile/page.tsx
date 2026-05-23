import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, Clapperboard, Star, Settings, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getMoviesByIds } from "@/lib/movies";
import { getSessionUser } from "@/lib/session";
import ProfileSettings from "@/components/auth/ProfileSettings";
import MovieCard from "@/components/ui/MovieCard";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all relevant movies (liked and watched)
  const allMovieIds = Array.from(new Set([
    ...user.likedMovieIds,
    ...user.watchedMovies.map(m => m.movieId)
  ]));
  
  const fetchedMovies = await getMoviesByIds(allMovieIds);
  
  const likedMovies = fetchedMovies.filter((movie) => user.likedMovieIds.includes(movie._id));
  
  const watchedEntries = user.watchedMovies
    .map((entry) => ({
      ...entry,
      movie: fetchedMovies.find((movie) => movie._id === entry.movieId),
    }))
    .filter((entry) => entry.movie);

  return (
    <>
      <Header />
      <main className="shell py-12">
        {/* Profile Header */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10131a] p-8 mb-10">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Clapperboard size={160} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-[#f5b84b] flex items-center justify-center text-[#08090d] text-4xl font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black">{user.name}</h1>
                  {user.role === "admin" && (
                    <span className="flex items-center gap-1 bg-[#f5b84b]/10 text-[#f5b84b] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck size={12} /> Admin
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[#a7adba] flex items-center gap-2">
                  <Mail size={14} /> {user.email}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="glass rounded-xl px-5 py-3 text-center min-w-[100px]">
                <p className="text-xl font-black text-[#f5b84b]">{likedMovies.length}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#a7adba]">Liked</p>
              </div>
              <div className="glass rounded-xl px-5 py-3 text-center min-w-[100px]">
                <p className="text-xl font-black text-[#4fb0c6]">{watchedEntries.length}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#a7adba]">Watched</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <div className="space-y-12">
            {/* Liked Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <Heart size={22} className="text-[#ef6461] fill-[#ef6461]" />
                  Liked Movies
                </h2>
                {likedMovies.length > 5 && (
                  <Link href="/profile/likes" className="text-sm font-bold text-[#f5b84b] hover:underline flex items-center gap-1">
                    View all <ArrowRight size={14} />
                  </Link>
                )}
              </div>
              
              {likedMovies.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {likedMovies.slice(0, 6).map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
                  <p className="text-[#a7adba]">Movies you like will appear here.</p>
                </div>
              )}
            </section>

            {/* Watched Movies Section */}
            <section>
              <h2 className="text-2xl font-black flex items-center gap-2 mb-6">
                <Star size={22} className="text-[#f5b84b]" />
                Recent Reviews
              </h2>
              
              {watchedEntries.length ? (
                <div className="space-y-4">
                  {watchedEntries.map((entry) => (
                    <article
                      key={entry.movieId}
                      className="glass grid gap-6 rounded-xl p-5 sm:grid-cols-[120px_1fr]"
                    >
                      <Link href={`/public/movies/${entry.movieId}`} className="block aspect-[2/3] overflow-hidden rounded-lg">
                        <img
                          alt=""
                          className="h-full w-full object-cover transition hover:scale-105"
                          src={entry.movie?.poster}
                        />
                      </Link>
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-xl font-black">{entry.movie?.title}</h4>
                          <span className="text-[10px] font-bold text-[#a7adba] whitespace-nowrap">
                            {new Date(entry.watchedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#d7d9de] italic">
                          "{entry.review || "No review written yet."}"
                        </p>
                        <div className="mt-6 flex gap-3">
                           <Link
                            className="text-xs font-bold text-[#f5b84b] hover:underline"
                            href={`/public/movies/${entry.movieId}`}
                          >
                            Edit review
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
                  <p className="text-[#a7adba]">No reviews written yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar / Settings */}
          <aside className="space-y-6">
             <ProfileSettings initialName={user.name} />
             
             {user.role === "admin" && (
               <Link href="/admin" className="block p-4 rounded-xl bg-[#f5b84b] text-[#08090d] font-bold text-center transition hover:opacity-90">
                 Platform Admin Panel
               </Link>
             )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
