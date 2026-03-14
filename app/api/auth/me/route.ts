import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getAuthSession } from "@/middleware/auth";
import { handleError, successResponse, errorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getAuthSession(req);

    const user = await User.findById(userId).select("name email");
    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    return handleError(error);
  }
}
