"use client";

import { useState } from "react";
import { Plus, X, Loader2, FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCollectionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, isPublic }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        setName("");
        setDescription("");
        setIsPublic(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create collection", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-12 items-center gap-2 rounded-lg bg-[#f5b84b] px-6 font-bold text-[#08090d] transition hover:scale-[1.02]"
      >
        <Plus size={18} />
        Create Collection
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#08090d]/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="glass relative w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <FolderPlus className="text-[#f5b84b]" />
                New Collection
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-white/10 text-[#a7adba] transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#d7d9de]">Collection Name</label>
                <input
                  autoFocus
                  required
                  type="text"
                  placeholder="e.g., My Favorite Thrillers"
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-[#f5b84b]/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#d7d9de]">Description (Optional)</label>
                <textarea
                  placeholder="Tell us what this collection is about..."
                  className="min-h-24 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#f5b84b]/50"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#f5b84b] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                </div>
                <span className="text-sm font-bold text-[#d7d9de]">Make this collection public</span>
              </label>

              <button
                disabled={loading || !name.trim()}
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#f5b84b] font-bold text-[#08090d] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                Create Collection
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
