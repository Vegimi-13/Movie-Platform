import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const faqs = [
  ["Can normal users add movies?", "No. Only the configured admin account can manage the main movie catalog."],
  ["Can users write reviews?", "Yes. Logged-in users can review movies and update their own review later."],
  ["What is the watched library?", "It is a personal profile section where users save movies they watched, grouped by genre."],
  ["Is MongoDB required?", "Yes. Users, movies, reviews, and favorites are stored with MongoDB models."],
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="shell py-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">FAQ</p>
        <h1 className="mt-2 text-4xl font-black">Project questions</h1>
        <div className="mt-8 space-y-3">
          {faqs.map(([question, answer]) => (
            <article key={question} className="glass rounded-lg p-5">
              <h2 className="text-xl font-black">{question}</h2>
              <p className="mt-2 text-[#a7adba]">{answer}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
