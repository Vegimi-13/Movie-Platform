"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Film, Loader2, Plus, ShieldAlert, Trash2, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import type { MovieItem } from "@/lib/demoMovies";

type MovieFormState = {
  title: string;
  description: string;
  genre: string;
  year: string;
  runtime: string;
  director: string;
  cast: string;
  poster: string;
  backdrop: string;
  trailerUrl: string;
  rating: string;
  featured: boolean;
};

const emptyForm: MovieFormState = {
  title: "",
  description: "",
  genre: "Drama",
  year: "2026",
  runtime: "2h 00m",
  director: "",
  cast: "",
  poster: "",
  backdrop: "",
  trailerUrl: "",
  rating: "8.0",
  featured: false,
};

export default function AdminPage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [form, setForm] = useState<MovieFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  // OMDB Search State
  const [omdbQuery, setOmdbQuery] = useState("");
  const [omdbResults, setOmdbResults] = useState<any[]>([]);
  const [searchingOmdb, setSearchingOmdb] = useState(false);

  const featuredCount = useMemo(
    () => movies.filter((movie) => movie.featured).length,
    [movies]
  );

  async function loadMovies() {
    setLoading(true);
    try {
      const response = await fetch("/api/movies", { cache: "no-store" });
      const data = await response.json();
      setMovies(data.movies ?? []);
    } catch {
      setMessage("MongoDB could not be reached from the admin panel.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        const admin = data.user?.role === "admin";
        setIsAdmin(admin);

        if (admin) {
          loadMovies();
        }
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAccess(false));
  }, []);

  async function handleOmdbSearch() {
    if (!omdbQuery.trim()) return;
    setSearchingOmdb(true);
    try {
      const res = await fetch(`/api/admin/omdb?query=${encodeURIComponent(omdbQuery)}`);
      const data = await res.json();
      if (data.success) {
        setOmdbResults(data.results);
      }
    } catch (err) {
      console.error("OMDB search failed", err);
    } finally {
      setSearchingOmdb(false);
    }
  }

  async function selectOmdbMovie(imdbID: string) {
    setSearchingOmdb(true);
    try {
      const res = await fetch(`/api/admin/omdb?imdbId=${imdbID}`);
      const data = await res.json();
      if (data.success && data.movie) {
        const m = data.movie;
        setForm({
          title: m.Title,
          description: m.Plot,
          genre: m.Genre.split(", ")[0],
          year: m.Year.substring(0, 4),
          runtime: m.Runtime,
          director: m.Director,
          cast: m.Actors,
          poster: m.Poster !== "N/A" ? m.Poster : "",
          backdrop: "",
          trailerUrl: "",
          rating: m.imdbRating !== "N/A" ? m.imdbRating : "8.0",
          featured: false,
        });
        setOmdbResults([]);
        setOmdbQuery("");
      }
    } catch (err) {
      console.error("Failed to fetch OMDB details", err);
    } finally {
      setSearchingOmdb(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Movie was not saved.");
      }

      setForm(emptyForm);
      setMessage("Movie saved to MongoDB.");
      await loadMovies();
    } catch {
      setMessage("Could not save the movie. Check required fields and MongoDB.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMovie(id: string) {
    setMessage("");
    try {
      const response = await fetch(`/api/movies/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      setMovies((current) => current.filter((movie) => movie._id !== id));
      setMessage("Movie deleted.");
    } catch {
      setMessage("Could not delete that movie.");
    }
  }

  function updateField(name: keyof MovieFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <>
      <Header />
      <main className="shell py-12">
        {checkingAccess ? (
          <div className="grid min-h-[50vh] place-items-center text-[#a7adba]">
            <Loader2 className="animate-spin" />
          </div>
        ) : !isAdmin ? (
          <section className="glass mx-auto max-w-xl rounded-lg p-8 text-center">
            <ShieldAlert className="mx-auto text-[#f5b84b]" size={42} />
            <h1 className="mt-4 text-3xl font-black">Admin access required</h1>
            <p className="mt-3 text-[#a7adba]">
              Login with an admin account to add, edit, or delete movies.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link className="rounded-lg bg-[#f5b84b] px-5 py-3 font-bold text-[#08090d]" href="/login">
                Login
              </Link>
              <Link className="rounded-lg border border-white/10 px-5 py-3 font-bold" href="/public">
                Home
              </Link>
            </div>
          </section>
        ) : (
          <>
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-black">Manage movies</h1>
            <p className="mt-3 max-w-2xl text-[#a7adba]">
              Add new movies directly into your connected MongoDB collection.
            </p>
          </div>
          <div className="glass grid grid-cols-2 gap-3 rounded-lg p-3 text-center">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-black">{movies.length}</p>
              <p className="text-xs text-[#a7adba]">Saved</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-black">{featuredCount}</p>
              <p className="text-xs text-[#a7adba]">Featured</p>
            </div>
          </div>
        </div>

        {message ? (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-[#d7d9de]">
            <CheckCircle2 size={18} className="text-[#f5b84b]" />
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            {/* OMDB Search Section */}
            <div className="glass rounded-lg p-5">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-[#f5b84b]">
                <Search size={20} />
                Import from OMDB
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search movie title..."
                  className="h-11 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-[#f5b84b]"
                  value={omdbQuery}
                  onChange={(e) => setOmdbQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleOmdbSearch()}
                />
                <button
                  onClick={handleOmdbSearch}
                  disabled={searchingOmdb}
                  className="flex h-11 items-center gap-2 rounded-lg bg-white/10 px-4 font-bold transition hover:bg-white/20 disabled:opacity-50"
                >
                  {searchingOmdb ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  Search
                </button>
              </div>

              {omdbResults.length > 0 && (
                <div className="mt-4 max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-[#08090d]/50">
                  {omdbResults.map((result) => (
                    <button
                      key={result.imdbID}
                      onClick={() => selectOmdbMovie(result.imdbID)}
                      className="flex w-full items-center gap-3 border-b border-white/5 p-2 text-left transition hover:bg-white/5 last:border-0"
                    >
                      <img src={result.Poster !== "N/A" ? result.Poster : ""} alt="" className="h-12 w-8 rounded object-cover bg-white/10" />
                      <div>
                        <p className="text-sm font-bold">{result.Title}</p>
                        <p className="text-xs text-[#a7adba]">{result.Year}</p>
                      </div>
                      <ExternalLink size={14} className="ml-auto text-[#a7adba]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form className="glass rounded-lg p-5" onSubmit={handleSubmit}>
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-black">
                <Plus size={22} className="text-[#f5b84b]" />
                {form.title ? "Review & Save" : "Add movie manually"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" name="title" required value={form.title} onChange={updateField} />
                <Field label="Genre" name="genre" required value={form.genre} onChange={updateField} />
                <Field label="Year" name="year" required type="number" value={form.year} onChange={updateField} />
                <Field label="Runtime" name="runtime" required value={form.runtime} onChange={updateField} />
                <Field label="Director" name="director" value={form.director} onChange={updateField} />
                <Field label="Rating" name="rating" required step="0.1" type="number" value={form.rating} onChange={updateField} />
                <Field label="Poster URL" name="poster" required value={form.poster} onChange={updateField} />
                <Field label="Backdrop URL" name="backdrop" value={form.backdrop} onChange={updateField} />
                <Field label="Trailer URL" name="trailerUrl" value={form.trailerUrl} onChange={updateField} />
                <Field label="Cast" name="cast" value={form.cast} onChange={updateField} placeholder="Actor, Actor, Actor" />
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Description</span>
                <textarea
                  className="min-h-32 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-[#f5b84b]"
                  required
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                />
              </label>
              <label className="mt-4 flex items-center gap-3 text-sm text-[#d7d9de]">
                <input
                  checked={form.featured}
                  className="h-4 w-4 accent-[#f5b84b]"
                  type="checkbox"
                  onChange={(event) => updateField("featured", event.target.checked)}
                />
                Feature this movie on the homepage
              </label>
              <button
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#f5b84b] font-bold text-[#08090d] hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                disabled={saving}
                type="submit"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Save to Database
              </button>
            </form>
          </div>

          <section className="glass rounded-lg p-5">
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-black">
              <Film size={22} className="text-[#f5b84b]" />
              MongoDB catalog
            </h2>
            {loading ? (
              <div className="grid min-h-60 place-items-center text-[#a7adba]">
                <Loader2 className="animate-spin" />
              </div>
            ) : movies.length ? (
              <div className="space-y-3">
                {movies.map((movie) => (
                  <article key={movie._id} className="flex gap-4 rounded-lg bg-white/5 p-3">
                    <img
                      alt=""
                      className="h-24 w-16 rounded-md object-cover"
                      src={movie.poster}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold">{movie.title}</h3>
                      <p className="mt-1 text-sm text-[#a7adba]">
                        {movie.genre} · {movie.year} · {Number(movie.rating).toFixed(1)}
                      </p>
                      <p className="line-clamp-2 mt-2 text-sm text-[#d7d9de]">{movie.description}</p>
                    </div>
                    <button
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-[#ef6461] hover:bg-white/10"
                      title="Delete movie"
                      type="button"
                      onClick={() => deleteMovie(movie._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white/5 p-8 text-center">
                <h3 className="text-xl font-black">No saved movies yet</h3>
                <p className="mt-2 text-sm text-[#a7adba]">
                  Add your first title and it will appear here and on the public pages.
                </p>
              </div>
            )}
          </section>
        </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  step,
  type = "text",
}: {
  label: string;
  name: keyof MovieFormState;
  value: string;
  onChange: (name: keyof MovieFormState, value: string) => void;
  placeholder?: string;
  required?: boolean;
  step?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#d7d9de]">{label}</span>
      <input
        className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-[#f5b84b]"
        name={name}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </label>
  );
}
