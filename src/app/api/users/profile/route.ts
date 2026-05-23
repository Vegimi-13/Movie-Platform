import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function PATCH(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const user = await User.findById(sessionUser.id);

    if (!user) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Update Name
    if (body.name && body.name.trim()) {
      user.name = body.name.trim();
    }

    // Update Password (if provided)
    if (body.newPassword && body.newPassword.length >= 6) {
      user.passwordHash = hashPassword(body.newPassword);
    }

    await user.save();

    return Response.json({ 
      success: true, 
      message: "Profile updated successfully.",
      user: { name: user.name }
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not update profile.", error: String(error) },
      { status: 500 }
    );
  }
}
