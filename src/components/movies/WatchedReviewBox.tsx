"use client";

import { BookMarked, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

export default function WatchedReviewBox({
  movieId,
  initialReview,
}: {
  movieId: string;
  initialReview?: string;
}) {
  const [review, setReview] = useState(initialReview ?? "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/watched", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, review }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Login required.");
        return;
      }

      setMessage("Saved to your watched library.");
    } catch {
      setMessage("Could not save this movie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="glass mt-7 rounded-lg p-5" onSubmit={submit}>
      <h2 className="flex items-center gap-2 text-xl font-black">
        <BookMarked size={20} className="text-[#f5b84b]" />
        Add to watched
      </h2>
      <textarea
        className="mt-4 min-h-28 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-[#f5b84b]"
        placeholder="Write your review or notes about this movie"
        value={review}
        onChange={(event) => setReview(event.target.value)}
      />
      <button
        className="mt-3 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f5b84b] px-5 font-bold text-[#08090d] hover:bg-white disabled:opacity-70"
        disabled={saving}
        type="submit"
      >
        {saving ? <Loader2 size={17} className="animate-spin" /> : <BookMarked size={17} />}
        Save watched movie
      </button>
      {message ? <p className="mt-3 text-sm text-[#f5b84b]">{message}</p> : null}
    </form>
  );
}
