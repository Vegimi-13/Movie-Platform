import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#08090d] px-6 text-center text-white">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">404</p>
        <h1 className="mt-3 text-4xl font-black">This scene is missing</h1>
        <p className="mt-3 text-[#a7adba]">The page or movie you opened could not be found.</p>
        <Link
          className="mt-7 inline-flex h-11 items-center rounded-lg bg-[#f5b84b] px-5 font-bold text-[#08090d]"
          href="/public"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
