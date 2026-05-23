import { Film, Search } from "lucide-react";
import Link from "next/link";
import AuthNav from "@/components/auth/AuthNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08090d]/82 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/public">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f5b84b] text-[#08090d]">
            <Film size={22} />
          </span>
          <span>
            <span className="block text-lg font-black tracking-wide">CineScope</span>
            <span className="block text-xs text-[#a7adba]">Movie Platform</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link className="rounded-lg px-3 py-2 text-sm text-[#d7d9de] hover:bg-white/10" href="/public/movies">
            Movies
          </Link>
          <Link className="rounded-lg px-3 py-2 text-sm text-[#d7d9de] hover:bg-white/10" href="/about">
            About
          </Link>
          <Link className="rounded-lg px-3 py-2 text-sm text-[#d7d9de] hover:bg-white/10" href="/contact">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="hidden h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-[#d7d9de] hover:bg-white/10 sm:flex"
            href="/public/movies"
            title="Browse movies"
          >
            <Search size={17} />
            Browse
          </Link>
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
