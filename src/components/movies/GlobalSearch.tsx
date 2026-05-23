"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import Link from "next/link";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full md:w-[460px]">
      <div className="glass flex h-11 items-center gap-2 rounded-lg px-3 focus-within:border-[#f5b84b]/50 transition">
        <Search size={18} className="text-[#f5b84b]" />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#707784]"
          placeholder="Live search millions of movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {loading && <Loader2 size={16} className="animate-spin text-[#a7adba]" />}
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }} className="text-[#a7adba] hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="glass absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <div className="max-h-[400px] overflow-y-auto p-2">
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[#a7adba]">
                Search Results from OMDB
              </p>
              {results.map((movie) => (
                <Link
                  key={movie.imdbID}
                  href={`/public/movies/${movie.imdbID}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/5"
                >
                  <img
                    src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.jpg"}
                    alt=""
                    className="h-14 w-10 rounded object-cover bg-white/5"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-white">{movie.Title}</h4>
                    <p className="text-xs text-[#a7adba]">{movie.Year} · {movie.Type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
