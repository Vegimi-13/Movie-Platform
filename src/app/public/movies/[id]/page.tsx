import { ArrowLeft, Clock, Play, Star, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getMovieById, getMovies } from "@/lib/movies";
import MovieGrid from "@/components/movies/MovieGrid";
import LikeButton from "@/components/movies/LikeButton";
import { getSessionUser } from "@/lib/session";
import WatchedReviewBox from "@/components/movies/WatchedReviewBox";
import ReviewPanel from "@/components/movies/ReviewPanel";
import { getReviewsForMovie } from "@/lib/reviews";
import AddToCollection from "@/components/movies/AddToCollection";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  const sessionUser = await getSessionUser();

  if (!movie) {
    notFound();
  }

  const related = (await getMovies())
    .filter((item) => item._id !== movie._id && item.genre === movie.genre)
    .slice(0, 5);
  const watchedMovie = sessionUser?.watchedMovies.find((item) => item.movieId === movie._id);
  const reviews = await getReviewsForMovie(movie._id);

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
            src={movie.backdrop || movie.poster}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/86 to-[#08090d]/55" />
          <div className="shell relative z-10 grid gap-10 py-12 lg:grid-cols-[320px_1fr] lg:py-20">
            <img
              alt={`${movie.title} poster`}
              className="poster-shadow aspect-[2/3] w-full max-w-[320px] rounded-lg object-cover"
              src={movie.poster}
            />
            <div className="flex flex-col justify-center">
              <Link className="mb-8 flex w-fit items-center gap-2 text-sm text-[#a7adba] hover:text-white" href="/public/movies">
                <ArrowLeft size={17} />
                Back to library
              </Link>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-md bg-[#f5b84b] px-3 py-1 font-bold text-[#08090d]">
                  {movie.genre}
                </span>
                <span>{movie.year}</span>
                <span className="flex items-center gap-1 text-[#f5b84b]">
                  <Star size={16} fill="currentColor" />
                  {movie.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1 text-[#d7d9de]">
                  <Clock size={16} />
                  {movie.runtime}
                </span>
              </div>
              <h1 className="text-5xl font-black leading-tight">{movie.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d7d9de]">{movie.description}</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="glass rounded-lg p-5">
                  <p className="flex items-center gap-2 text-sm font-bold text-[#f5b84b]">
                    <UserRound size={17} />
                    Director
                  </p>
                  <p className="mt-2 text-xl font-bold">{movie.director}</p>
                </div>
                <div className="glass rounded-lg p-5">
                  <p className="text-sm font-bold text-[#f5b84b]">Cast</p>
                  <p className="mt-2 text-[#d7d9de]">
                    {movie.cast.length ? movie.cast.join(", ") : "Cast details coming soon"}
                  </p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {movie.trailerUrl && (
                  <a
                    className="flex h-12 w-fit items-center gap-2 rounded-lg bg-white px-5 font-bold text-[#08090d] hover:bg-[#f5b84b]"
                    href={movie.trailerUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Play size={18} fill="currentColor" />
                    Open trailer
                  </a>
                )}
                <LikeButton
                  initiallyLiked={Boolean(sessionUser?.likedMovieIds.includes(movie._id))}
                  movieId={movie._id}
                />
                {sessionUser && (
                  <AddToCollection movieId={movie._id} />
                )}
              </div>
              <WatchedReviewBox
                initialReview={watchedMovie?.review}
                movieId={movie._id}
              />
            </div>
          </div>
        </section>

        {related.length ? (
          <section className="shell py-16">
            <h2 className="mb-7 text-3xl font-black">More {movie.genre} movies</h2>
            <MovieGrid movies={related} />
          </section>
        ) : null}
        <ReviewPanel
          currentUserId={sessionUser?.id}
          currentUserRole={sessionUser?.role}
          movieId={movie._id}
          reviews={reviews}
        />
      </main>
      <Footer />
    </>
  );
}
