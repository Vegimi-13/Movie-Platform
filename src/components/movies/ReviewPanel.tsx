"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, MessageSquare, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReviewItem } from "@/lib/reviews";

export default function ReviewPanel({
  movieId,
  reviews,
  currentUserId,
  currentUserRole,
}: {
  movieId: string;
  reviews: ReviewItem[];
  currentUserId?: string;
  currentUserRole?: "user" | "admin";
}) {
  const router = useRouter();
  const myReview = useMemo(
    () => reviews.find((review) => review.userId === currentUserId),
    [currentUserId, reviews]
  );
  const [rating, setRating] = useState(String(myReview?.rating ?? 8));
  const [comment, setComment] = useState(myReview?.comment ?? "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, rating, comment }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Could not save review.");
        return;
      }

      setMessage("Review saved.");
      router.refresh();
    } catch {
      setMessage("Could not save review.");
    } finally {
      setSaving(false);
    }
  }

  async function removeReview(id: string) {
    const response = await fetch(`/api/reviews/${id}`, { method: "DELETE" });

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <section className="shell py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
            Reviews
          </p>
          <h2 className="mt-2 text-3xl font-black">Audience notes</h2>
        </div>
        <span className="rounded-md bg-white/10 px-3 py-2 text-sm font-bold">
          {reviews.length} reviews
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="glass rounded-lg p-5" onSubmit={submit}>
          <h3 className="flex items-center gap-2 text-xl font-black">
            <MessageSquare size={20} className="text-[#f5b84b]" />
            {myReview ? "Update your review" : "Write a review"}
          </h3>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Rating</span>
            <input
              className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
              max={10}
              min={1}
              step={0.5}
              type="number"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Review</span>
            <textarea
              className="min-h-28 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-[#f5b84b]"
              placeholder="What did you think?"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
          <button
            className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f5b84b] px-5 font-bold text-[#08090d] hover:bg-white disabled:opacity-70"
            disabled={saving}
            type="submit"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Star size={17} />}
            Save review
          </button>
          {message ? <p className="mt-3 text-sm text-[#f5b84b]">{message}</p> : null}
        </form>

        <div className="space-y-3">
          {reviews.length ? (
            reviews.map((review) => (
              <article key={review._id} className="glass rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black">{review.userName}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-[#f5b84b]">
                      <Star size={15} fill="currentColor" />
                      {review.rating.toFixed(1)}
                    </p>
                  </div>
                  {review.userId === currentUserId || currentUserRole === "admin" ? (
                    <button
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[#ef6461] hover:bg-white/10"
                      title="Delete review"
                      type="button"
                      onClick={() => removeReview(review._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#d7d9de]">{review.comment}</p>
              </article>
            ))
          ) : (
            <div className="glass rounded-lg p-8 text-center text-[#a7adba]">
              No reviews yet. Be the first to write one.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
