"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function JoinCollectionPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Joining collection...");
  const [collectionId, setCollectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invite link. Token is missing.");
      return;
    }

    const join = async () => {
      try {
        const res = await fetch("/api/collections/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          setCollectionId(data.collectionId);
          // Redirect after a short delay
          setTimeout(() => {
            router.push(`/profile/collections/${data.collectionId}`);
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong while joining the collection.");
      }
    };

    join();
  }, [token, router]);

  return (
    <>
      <Header />
      <main className="shell py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass max-w-md w-full p-10 rounded-2xl text-center shadow-2xl border border-white/10">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <Loader2 size={48} className="animate-spin text-[#f5b84b] mb-6" />
              <h1 className="text-2xl font-black mb-2">Joining Collection</h1>
              <p className="text-[#a7adba]">Please wait while we add you to the list...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="h-16 w-16 bg-[#4fb0c6]/20 text-[#4fb0c6] rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-2xl font-black mb-2 text-white">Success!</h1>
              <p className="text-[#a7adba] mb-8">{message}</p>
              <Link 
                href={`/profile/collections/${collectionId}`}
                className="flex items-center gap-2 bg-[#f5b84b] text-[#08090d] font-bold px-6 py-3 rounded-lg hover:scale-105 transition"
              >
                Go to Collection <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="h-16 w-16 bg-[#ef6461]/20 text-[#ef6461] rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} />
              </div>
              <h1 className="text-2xl font-black mb-2 text-white">Oops!</h1>
              <p className="text-[#a7adba] mb-8">{message}</p>
              <Link 
                href="/profile/collections"
                className="text-[#f5b84b] font-bold hover:underline"
              >
                Back to my collections
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
