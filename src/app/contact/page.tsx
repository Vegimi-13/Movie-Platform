import ContactForm from "@/components/contact/ContactForm";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="shell grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-black">Send feedback</h1>
          <p className="mt-4 text-lg leading-8 text-[#d7d9de]">
            This form demonstrates client-side validation with React Hook Form
            and success/error states for the university requirements.
          </p>
        </div>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
