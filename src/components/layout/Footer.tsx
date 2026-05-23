import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-sm text-[#a7adba]">
      <div className="shell flex flex-col justify-between gap-3 sm:flex-row">
        <p>CineScope, built with Next.js and MongoDB.</p>
        <div className="flex gap-4">
          <Link className="hover:text-white" href="/public/movies">
            Movies
          </Link>
          <Link className="hover:text-white" href="/admin">
            Admin
          </Link>
          <Link className="hover:text-white" href="/faq">
            FAQ
          </Link>
          <Link className="hover:text-white" href="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
