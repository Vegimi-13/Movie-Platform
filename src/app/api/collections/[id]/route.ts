import { connectDB } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";
import Collection from "@/models/Collection";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();
    const collection = await Collection.findById(id).lean();

    if (!collection) {
      return Response.json({ success: false, message: "Collection not found." }, { status: 404 });
    }

    // Check privacy
    const user = await getSessionUser();
    if (!collection.isPublic && (!user || String(user.id) !== String(collection.userId))) {
      return Response.json({ success: false, message: "Private collection." }, { status: 403 });
    }

    return Response.json({ success: true, collection });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not load collection.", error: String(error) },
      { status: 500 }
    );
  }
}

import { randomBytes } from "crypto";

// ... existing code ...

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  const { id } = await params;

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const collection = await Collection.findById(id);

    if (!collection) {
      return Response.json({ success: false, message: "Collection not found." }, { status: 404 });
    }

    const isOwner = String(collection.userId) === String(user.id);
    const collaboratorIds = collection.collaboratorIds || [];
    const isCollaborator = collaboratorIds.some((cId: any) => String(cId) === String(user.id));

    if (!isOwner && !isCollaborator) {
      return Response.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    // Only owner can update metadata or generate invite
    if (isOwner) {
      if (body.name !== undefined) collection.name = body.name;
      if (body.description !== undefined) collection.description = body.description;
      if (body.isPublic !== undefined) collection.isPublic = !!body.isPublic;
      
      if (body.generateInvite) {
        collection.inviteToken = randomBytes(16).toString("hex");
      }
    }

    // Both owner and collaborator can add/remove movies
    if (body.addMovieId) {
      const movieIdToAdd = String(body.addMovieId).trim();
      if (!collection.movieIds.includes(movieIdToAdd)) {
        collection.movieIds.push(movieIdToAdd);
        collection.markModified("movieIds");
      }
    }

    if (body.removeMovieId) {
      const movieIdToRemove = String(body.removeMovieId).trim();
      collection.movieIds = collection.movieIds.filter((m: string) => m !== movieIdToRemove);
      collection.markModified("movieIds");
    }

    await collection.save();

    return Response.json({ success: true, collection });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not update collection.", error: String(error) },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  const { id } = await params;

  if (!user) {
    return Response.json({ success: false, message: "Login required." }, { status: 401 });
  }

  try {
    await connectDB();
    const result = await Collection.deleteOne({ _id: id, userId: user.id });

    if (result.deletedCount === 0) {
      return Response.json({ success: false, message: "Collection not found or unauthorized." }, { status: 404 });
    }

    return Response.json({ success: true, message: "Collection deleted." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not delete collection.", error: String(error) },
      { status: 500 }
    );
  }
}
