import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="shell py-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
          About
        </p>
        <h1 className="mt-2 text-4xl font-black">A personal movie platform</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d7d9de]">
          CineScope helps users discover movies, save favorites, build a watched
          library, and write reviews. Admin users manage the movie catalog while
          normal users create their own profile and viewing history.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Discovery", "Browse and filter movies by genre, rating, and story."],
            ["Profiles", "Track watched movies and personal reviews."],
            ["Admin", "Protected catalog management with role-based access."],
          ].map(([title, text]) => (
            <article key={title} className="glass rounded-lg p-5">
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#a7adba]">{text}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
