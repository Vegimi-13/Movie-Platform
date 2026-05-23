import { authOptions } from "@/lib/auth";

export async function POST() {
  return Response.json({
    success: false,
    message:
      "Use NextAuth credentials sign-in at /api/auth/callback/credentials.",
    providers: authOptions.providers.map((provider) => provider.id),
  }, { status: 410 });
}
