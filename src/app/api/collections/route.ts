import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Collection from "@/models/Collection";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const collections = await Collection.find({
      $or: [
        { userId: user.id },
        { collaboratorIds: user.id }
      ]
    })
      .sort({ updatedAt: -1 })
      .lean();

    return Response.json({ success: true, collections });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not load collections.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const { name, description, isPublic, movieIds } = await request.json();

    if (!name) {
      return Response.json({ success: false, message: "Collection name is required." }, { status: 400 });
    }

    const collection = await Collection.create({
      name,
      description,
      isPublic: !!isPublic,
      userId: user.id,
      movieIds: movieIds || [],
    });

    return Response.json({ success: true, collection }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not create collection.", error: String(error) },
      { status: 400 }
    );
  }
}
