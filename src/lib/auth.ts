import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ?? "admin@cinescope.local"
).toLowerCase();
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin123!";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const hashedBuffer = Buffer.from(hash, "hex");
  const suppliedBuffer = scryptSync(password, salt, 64);

  return timingSafeEqual(hashedBuffer, suppliedBuffer);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "development-cinescope-secret",
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        const isAdminLogin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
        let user = await User.findOne({ email });

        if (isAdminLogin) {
          user = await User.findOneAndUpdate(
            { email },
            {
              $set: {
                name: "CineScope Admin",
                email,
                role: "admin",
                passwordHash: hashPassword(password),
              },
              $setOnInsert: {
                watchedMovies: [],
              },
            },
            { new: true, upsert: true }
          );
        }

        if (!user || (!isAdminLogin && !verifyPassword(password, user.passwordHash))) {
          return null;
        }

        const role = user.email === ADMIN_EMAIL && user.role === "admin" ? "admin" : "user";

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role === "admin" ? "admin" : "user";
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
