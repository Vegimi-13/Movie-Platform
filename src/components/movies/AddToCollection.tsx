"use client";

import { useState, useEffect } from "react";
import { Plus, ListPlus, Check, Loader2, FolderPlus } from "lucide-react";

interface Collection {
  _id: string;
  name: string;
  movieIds: string[];
}

export default function AddToCollection({ movieId }: { movieId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (error) {
      console.error("Failed to fetch collections", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const toggleMovieInCollection = async (collectionId: string, isInCollection: boolean) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [isInCollection ? "removeMovieId" : "addMovieId"]: movieId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state immediately
        setCollections((prev) =>
          prev.map((c) => (c._id === collectionId ? data.collection : c))
        );
        // Also refetch to be absolutely sure
        fetchCollections();
      }
    } catch (error) {
      console.error("Failed to update collection", error);
    }
  };

  const createAndAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, movieIds: [movieId] }),
      });
      const data = await res.json();
      if (data.success) {
        setNewName("");
        setIsCreating(false);
        await fetchCollections();
      }
    } catch (error) {
      console.error("Failed to create collection", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-fit items-center gap-2 rounded-lg border border-white/10 bg-[#171b24] px-5 font-bold text-white transition hover:border-[#f5b84b]/60 hover:bg-[#1c212c]"
      >
        <ListPlus size={18} />
        Add to Collection
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="glass absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-xl p-2 shadow-2xl">
            <div className="max-h-60 overflow-y-auto">
              {loading && collections.length === 0 ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-[#f5b84b]" size={20} />
                </div>
              ) : collections.length === 0 && !isCreating ? (
                <p className="py-4 text-center text-sm text-[#a7adba]">
                  No collections yet.
                </p>
              ) : (
                collections.map((c) => {
                  const isIn = c.movieIds.includes(movieId);
                  return (
                    <button
                      key={c._id}
                      onClick={() => toggleMovieInCollection(c._id, isIn)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-white/5"
                    >
                      <span className={isIn ? "text-[#f5b84b]" : "text-white"}>
                        {c.name}
                      </span>
                      {isIn && <Check size={14} className="text-[#f5b84b]" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-2 border-t border-white/10 pt-2">
              {isCreating ? (
                <div className="flex flex-col gap-2 p-1">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Collection name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-md border border-white/10 bg-[#08090d] px-3 py-1.5 text-sm text-white outline-none focus:border-[#f5b84b]/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createAndAdd}
                      disabled={loading || !newName.trim()}
                      className="flex-1 rounded-md bg-[#f5b84b] py-1.5 text-xs font-bold text-[#08090d] hover:bg-[#f5b84b]/90 disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="flex-1 rounded-md bg-white/5 py-1.5 text-xs font-bold text-white hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#f5b84b] transition hover:bg-[#f5b84b]/10"
                >
                  <FolderPlus size={16} />
                  New collection
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
