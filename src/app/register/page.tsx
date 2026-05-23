import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="shell grid min-h-[calc(100vh-9rem)] place-items-center py-12">
        <RegisterForm />
      </main>
      <Footer />
    </>
  );
}
