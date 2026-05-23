import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Collection from "@/models/Collection";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const { token } = await request.json();

    if (!token) {
      return Response.json({ success: false, message: "Invite token is required." }, { status: 400 });
    }

    const collection = await Collection.findOne({ inviteToken: token });

    if (!collection) {
      return Response.json({ success: false, message: "Invalid or expired invite link." }, { status: 404 });
    }

    // Owner cannot join their own collection as collaborator
    if (String(collection.userId) === String(user.id)) {
      return Response.json({ success: true, message: "You are the owner of this collection.", collectionId: collection._id });
    }

    // Check if already a collaborator
    if (!collection.collaboratorIds) {
      collection.collaboratorIds = [];
    }
    
    if (collection.collaboratorIds.some((cId: any) => String(cId) === String(user.id))) {
      return Response.json({ success: true, message: "You are already a collaborator.", collectionId: collection._id });
    }

    collection.collaboratorIds.push(user.id);
    await collection.save();

    return Response.json({ success: true, message: "Joined collection successfully!", collectionId: collection._id });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not join collection.", error: String(error) },
      { status: 500 }
    );
  }
}
