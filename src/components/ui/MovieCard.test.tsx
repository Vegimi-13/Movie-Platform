import { render, screen } from "@testing-library/react";
import MovieCard from "@/components/ui/MovieCard";
import type { MovieItem } from "@/lib/demoMovies";

const movie: MovieItem = {
  _id: "movie-1",
  title: "Test Movie",
  description: "A movie used in component tests.",
  genre: "Drama",
  year: 2026,
  runtime: "1h 45m",
  director: "Test Director",
  cast: ["Actor One"],
  poster: "https://example.com/poster.jpg",
  backdrop: "https://example.com/backdrop.jpg",
  trailerUrl: "https://example.com/trailer",
  rating: 8.4,
};

describe("MovieCard", () => {
  it("renders movie details and links to the detail page", () => {
    render(<MovieCard movie={movie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("Drama · 2026")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/public/movies/movie-1");
  });
});
