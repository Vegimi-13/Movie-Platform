"use client";

import { useState } from "react";
import { Trash2, Globe, Lock, Loader2, X, Share2, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CollectionManagement({ 
  collectionId, 
  initialIsPublic,
  initialInviteToken,
  isOwner
}: { 
  collectionId: string;
  initialIsPublic: boolean;
  initialInviteToken?: string;
  isOwner: boolean;
}) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [inviteToken, setInviteToken] = useState(initialInviteToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const togglePrivacy = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (res.ok) {
        setIsPublic(!isPublic);
      }
    } catch (error) {
      console.error("Failed to toggle privacy", error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generateInvite: true }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteToken(data.collection.inviteToken);
      }
    } catch (error) {
      console.error("Failed to generate invite", error);
    } finally {
      setLoading(false);
    }
  };

  const copyInvite = () => {
    const url = `${window.location.origin}/profile/collections/join?token=${inviteToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteCollection = async () => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/profile/collections");
      }
    } catch (error) {
      console.error("Failed to delete collection", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {isOwner && (
        <>
          <button
            onClick={togglePrivacy}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-lg bg-white/5 px-4 text-sm font-bold transition hover:bg-white/10"
          >
            {loading && !inviteToken ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isPublic ? (
              <>
                <Globe size={16} className="text-[#4fb0c6]" />
                Public
              </>
            ) : (
              <>
                <Lock size={16} className="text-[#a7adba]" />
                Private
              </>
            )}
          </button>

          {inviteToken ? (
            <button
              onClick={copyInvite}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#4fb0c6]/10 px-4 text-sm font-bold text-[#4fb0c6] transition hover:bg-[#4fb0c6]/20"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Invite Link"}
            </button>
          ) : (
            <button
              onClick={generateInvite}
              disabled={loading}
              className="flex h-10 items-center gap-2 rounded-lg bg-white/5 px-4 text-sm font-bold transition hover:bg-white/10"
            >
              <Share2 size={16} />
              Collaborate
            </button>
          )}

          <button
            onClick={deleteCollection}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-lg bg-white/5 px-4 text-sm font-bold text-[#ef6461] transition hover:bg-[#ef6461]/10"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export function RemoveFromCollection({ 
  collectionId, 
  movieId 
}: { 
  collectionId: string;
  movieId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeMovieId: movieId }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to remove movie", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        remove();
      }}
      disabled={loading}
      className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#08090d]/80 text-white opacity-0 transition group-hover:opacity-100 hover:bg-[#ef6461]"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <X size={16} />}
    </button>
  );
}
