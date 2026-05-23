import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock, Star } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSessionUser } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { getMoviesByIds } from "@/lib/movies";
import MovieCard from "@/components/ui/MovieCard";
import CollectionManagement, { RemoveFromCollection } from "@/components/movies/CollectionManagement";
import User from "@/models/User";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();

  await connectDB();
  const collection = await Collection.findById(id).lean();

  if (!collection) {
    notFound();
  }

  const isOwner = user && String(user.id) === String(collection.userId);
  const isCollaborator = user && (collection.collaboratorIds || []).some((cId: any) => String(cId) === String(user.id));

  if (!collection.isPublic && !isOwner && !isCollaborator) {
    redirect("/login");
  }

  const movies = await getMoviesByIds(collection.movieIds);
  
  // Fetch collaborator details
  const collaborators = await User.find({
    _id: { $in: collection.collaboratorIds }
  }).select("name").lean();

  return (
    <>
      <Header />
      <main className="shell py-12">
        <Link
          href="/profile/collections"
          className="mb-8 flex w-fit items-center gap-2 text-sm text-[#a7adba] hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to collections
        </Link>

        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-black">{collection.name}</h1>
               {isCollaborator && !isOwner && (
                 <span className="bg-[#4fb0c6]/10 text-[#4fb0c6] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Collaborator</span>
               )}
            </div>
            <p className="mt-3 max-w-2xl text-lg text-[#d7d9de]">
              {collection.description || "No description provided."}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-[#a7adba]">
              <span>{movies.length} movies</span>
              <span>•</span>
              <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
              
              {(collaborators.length > 0) && (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {collaborators.map((c: any) => (
                      <div 
                        key={String(c._id)} 
                        title={c.name}
                        className="h-8 w-8 rounded-full border-2 border-[#08090d] bg-[#4fb0c6] flex items-center justify-center text-[10px] font-bold text-[#08090d]"
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs">{collaborators.length} collaborators</span>
                </div>
              )}
            </div>
          </div>
          <CollectionManagement 
            collectionId={String(collection._id)} 
            initialIsPublic={collection.isPublic} 
            initialInviteToken={collection.inviteToken}
            isOwner={isOwner || false}
          />
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <div key={movie._id} className="group relative">
                {(isOwner || isCollaborator) && (
                  <RemoveFromCollection 
                    collectionId={String(collection._id)} 
                    movieId={movie._id} 
                  />
                )}
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-16 text-center">
            <h2 className="text-2xl font-black">This collection is empty</h2>
            <p className="mt-3 text-[#a7adba]">
              Browse the library and add some movies to this collection.
            </p>
            <Link
              href="/public/movies"
              className="mt-8 inline-flex h-12 items-center rounded-lg bg-[#f5b84b] px-8 font-bold text-[#08090d]"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
