"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export default function LikeButton({
  movieId,
  initiallyLiked,
}: {
  movieId: string;
  initiallyLiked: boolean;
}) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function toggleLike() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Login required.");
        return;
      }

      setLiked(data.liked);
    } catch {
      setMessage("Could not update like.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button
        className="flex h-12 items-center gap-2 rounded-lg border border-white/15 px-5 font-bold text-white hover:bg-white/10 disabled:opacity-70"
        disabled={saving}
        type="button"
        onClick={toggleLike}
      >
        <Heart size={18} fill={liked ? "#ef6461" : "none"} className={liked ? "text-[#ef6461]" : ""} />
        {liked ? "Liked" : "Like"}
      </button>
      {message ? <p className="mt-2 text-sm text-[#f5b84b]">{message}</p> : null}
    </div>
  );
}
