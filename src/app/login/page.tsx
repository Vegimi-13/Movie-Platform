import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="shell grid min-h-[calc(100vh-9rem)] place-items-center py-12">
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
