"use client";

import { FormEvent, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Registration failed.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/profile");
    } catch {
      setMessage("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="glass w-full max-w-md rounded-lg p-6" onSubmit={submit}>
      <h1 className="text-3xl font-black">Create account</h1>
      <p className="mt-2 text-sm text-[#a7adba]">
        The first registered user becomes the admin for this MongoDB database.
      </p>
      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Name</span>
        <input
          className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Email</span>
        <input
          className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Password</span>
        <input
          className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
          minLength={6}
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {message ? <p className="mt-4 text-sm text-[#f5b84b]">{message}</p> : null}
      <button
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#f5b84b] font-bold text-[#08090d] hover:bg-white disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
        Register
      </button>
      <p className="mt-5 text-center text-sm text-[#a7adba]">
        Already registered?{" "}
        <Link className="font-bold text-[#f5b84b]" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
