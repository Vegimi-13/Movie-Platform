import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!name || !email || password.length < 6) {
      return Response.json(
        { success: false, message: "Name, email, and a 6 character password are required." },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return Response.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await User.create({
      name,
      email,
      role: "user",
      passwordHash: hashPassword(password),
      likedMovieIds: [],
      watchedMovies: [],
    });

    return Response.json({
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        likedMovieIds: user.likedMovieIds,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Registration failed.", error: String(error) },
      { status: 500 }
    );
  }
}
