import { redirect } from "next/navigation";
import { FolderHeart, Plus, Trash2, ExternalLink, Users } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSessionUser } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/models/Collection";

import CreateCollectionModal from "@/components/movies/CreateCollectionModal";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  await connectDB();
  const collections = await Collection.find({ 
    $or: [
      { userId: user.id },
      { collaboratorIds: user.id }
    ]
  })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <>
      <Header />
      <main className="shell py-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
              Your Library
            </p>
            <h1 className="mt-2 text-4xl font-black">Custom Collections</h1>
            <p className="mt-3 max-w-2xl text-[#a7adba]">
              Organize your movies into personal lists for any occasion.
            </p>
          </div>
          <CreateCollectionModal />
        </div>

        {collections.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((col: any) => {
              const isOwner = String(col.userId) === String(user.id);
              return (
                <Link
                  key={String(col._id)}
                  href={`/profile/collections/${col._id}`}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#10131a] p-6 transition hover:border-[#f5b84b]/40 hover:bg-[#171b24]"
                >
                  <div className="flex items-start justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-lg ${isOwner ? 'bg-white/5 text-[#f5b84b]' : 'bg-[#4fb0c6]/10 text-[#4fb0c6]'} group-hover:scale-110 transition`}>
                      {isOwner ? <FolderHeart size={24} /> : <Users size={24} />}
                    </div>
                    <div className="flex gap-2">
                      {!isOwner && (
                        <span className="rounded-md bg-[#4fb0c6]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4fb0c6]">
                          Collaborating
                        </span>
                      )}
                      {col.isPublic ? (
                        <span className="rounded-md bg-[#4fb0c6]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4fb0c6]">
                          Public
                        </span>
                      ) : (
                        <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a7adba]">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="mt-5 text-xl font-black group-hover:text-[#f5b84b]">
                    {col.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-[#a7adba]">
                    {col.description || "No description provided."}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-sm font-bold text-[#d7d9de]">
                      {col.movieIds.length} {col.movieIds.length === 1 ? 'movie' : 'movies'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#f5b84b] opacity-0 transition group-hover:opacity-100">
                      View Collection <ExternalLink size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-white/5 text-[#a7adba]">
              <FolderHeart size={40} />
            </div>
            <h2 className="text-2xl font-black">No collections yet</h2>
            <p className="mt-3 text-[#a7adba]">
              Start by opening any movie and adding it to a new collection.
            </p>
            <Link
              href="/public/movies"
              className="mt-8 inline-flex h-12 items-center rounded-lg border border-[#f5b84b] px-8 font-bold text-[#f5b84b] transition hover:bg-[#f5b84b] hover:text-[#08090d]"
            >
              Explore Movies
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
