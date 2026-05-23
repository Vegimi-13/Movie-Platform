"use client";

import { FolderHeart, Gauge, LogIn, LogOut, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type CurrentUser = {
  name: string;
  role: "user" | "admin";
} | null;

export default function AuthNav() {
  const { data: session } = useSession();
  const user = (session?.user ?? null) as CurrentUser;

  if (!user) {
    return (
      <Link
        className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-[#d7d9de] hover:bg-white/10"
        href="/login"
        title="Login"
      >
        <LogIn size={18} />
      </Link>
    );
  }

  return (
    <>
      <Link
        className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-[#d7d9de] hover:bg-white/10"
        href="/profile/collections"
        title="My Collections"
      >
        <FolderHeart size={18} />
      </Link>
      {user.role === "admin" ? (
        <>
          <Link
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#f5b84b]/40 text-[#f5b84b] hover:bg-white/10"
            href="/dashboard"
            title="Admin dashboard"
          >
            <Gauge size={18} />
          </Link>
          <Link
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#f5b84b]/40 text-[#f5b84b] hover:bg-white/10"
            href="/admin"
            title="Admin movie manager"
          >
            <Shield size={18} />
          </Link>
        </>
      ) : null}
      <Link
        className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-[#d7d9de] hover:bg-white/10"
        href="/profile"
        title={user.name}
      >
        <UserRound size={18} />
      </Link>
      <button
        className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-[#d7d9de] hover:bg-white/10"
        title="Logout"
        type="button"
        onClick={() => signOut({ callbackUrl: "/public" })}
      >
        <LogOut size={18} />
      </button>
    </>
  );
}
