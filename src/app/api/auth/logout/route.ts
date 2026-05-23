export async function POST() {
  return Response.json(
    {
      success: false,
      message: "Use the NextAuth signOut flow at /api/auth/signout.",
    },
    { status: 410 }
  );
}
