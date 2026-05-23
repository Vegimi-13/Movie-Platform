"use client";

import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginValues>();

  async function submit(values: LoginValues) {
    setMessage("");

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Invalid email or password.");
        return;
      }

      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await response.json();

      router.push(data.user?.role === "admin" ? "/admin" : "/profile");
    } catch {
      setMessage("Login failed.");
    }
  }

  return (
    <form className="glass w-full max-w-md rounded-lg p-6" onSubmit={handleSubmit(submit)}>
      <h1 className="text-3xl font-black">Welcome back</h1>
      <p className="mt-2 text-sm text-[#a7adba]">
        Sign in to like movies and manage the platform if you are an admin.
      </p>
      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Email</span>
        <input
          className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email ? <p className="mt-2 text-sm text-[#f5b84b]">{errors.email.message}</p> : null}
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Password</span>
        <input
          className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password ? <p className="mt-2 text-sm text-[#f5b84b]">{errors.password.message}</p> : null}
      </label>
      {message ? <p className="mt-4 text-sm text-[#f5b84b]">{message}</p> : null}
      <button
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#f5b84b] font-bold text-[#08090d] hover:bg-white disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
        Login
      </button>
      <p className="mt-5 text-center text-sm text-[#a7adba]">
        No account?{" "}
        <Link className="font-bold text-[#f5b84b]" href="/register">
          Register
        </Link>
      </p>
    </form>
  );
}
