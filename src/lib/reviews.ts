import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

export type ReviewItem = {
  _id: string;
  userId: string;
  userName: string;
  movieId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

function normalizeReview(review: Record<string, unknown>): ReviewItem {
  return {
    _id: String(review._id),
    userId: String(review.userId),
    userName: String(review.userName ?? "Movie fan"),
    movieId: String(review.movieId),
    rating: Number(review.rating ?? 0),
    comment: String(review.comment ?? ""),
    createdAt:
      review.createdAt instanceof Date
        ? review.createdAt.toISOString()
        : String(review.createdAt ?? new Date().toISOString()),
    updatedAt:
      review.updatedAt instanceof Date
        ? review.updatedAt.toISOString()
        : String(review.updatedAt ?? new Date().toISOString()),
  };
}

export async function getReviewsForMovie(movieId: string): Promise<ReviewItem[]> {
  try {
    await connectDB();
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 }).lean();

    return reviews.map((review) => normalizeReview(review as Record<string, unknown>));
  } catch {
    return [];
  }
}
