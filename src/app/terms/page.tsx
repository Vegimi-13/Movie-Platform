import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="shell py-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
          Terms
        </p>
        <h1 className="mt-2 text-4xl font-black">Terms and conditions</h1>
        <div className="glass mt-8 space-y-5 rounded-lg p-6 text-[#d7d9de]">
          <p>
            CineScope is a university project for demonstrating full-stack web
            development with Next.js, MongoDB, authentication, CRUD operations,
            and responsive UI design.
          </p>
          <p>
            User reviews should be respectful and relevant to the movie. Admins
            may remove content during catalog moderation.
          </p>
          <p>
            Demo movie metadata and poster URLs are used for educational
            purposes only.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
