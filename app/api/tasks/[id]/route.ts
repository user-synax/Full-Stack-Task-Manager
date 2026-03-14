import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Task, { TaskStatus, TaskPriority } from "@/models/Task";
import { encrypt, decrypt } from "@/lib/crypto";
import { getAuthSession } from "@/middleware/auth";
import { taskSchema } from "@/utils/validation";
import {
    handleError,
    successResponse,
    errorResponse,
} from "@/utils/errorHandler";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        await dbConnect();
        const userId = await getAuthSession(req);
        const body = await req.json();

        // Validate input
        const validatedData = taskSchema.parse(body);

        // Check if task exists and belongs to user
        const task = await Task.findOne({ _id: id, userId });
        if (!task) {
            return errorResponse("Task not found or unauthorized", 404);
        }

        // Encrypt description
        const encryptedDescription = encrypt(validatedData.description);

        // Update task
        task.title = validatedData.title;
        task.description = encryptedDescription;
        if (validatedData.status) {
            task.status = validatedData.status as TaskStatus;
        }
        if (validatedData.priority) {
            task.priority = validatedData.priority as TaskPriority;
        }
        
        // Handle dueDate: null, undefined or valid date string
        if (validatedData.dueDate && validatedData.dueDate.trim() !== "") {
            task.dueDate = new Date(validatedData.dueDate);
        } else {
            task.dueDate = undefined;
        }
        
        await task.save();

        const taskObj = task.toObject();
        taskObj.description = decrypt(taskObj.description);

        return successResponse(taskObj);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return handleError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        await dbConnect();
        const userId = await getAuthSession(req);

        // Check if task exists and belongs to user
        const task = await Task.findOneAndDelete({ _id: id, userId });
        if (!task) {
            return errorResponse("Task not found or unauthorized", 404);
        }

        return successResponse({ message: "Task deleted successfully" });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return handleError(error);
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        await dbConnect();
        const userId = await getAuthSession(req);

        const task = await Task.findOne({ _id: id, userId });
        if (!task) {
            return errorResponse("Task not found or unauthorized", 404);
        }

        const taskObj = task.toObject();
        try {
            taskObj.description = decrypt(taskObj.description);
        } catch (err) {
            console.error("Decryption failed for task", taskObj._id);
            taskObj.description = "Error decrypting description";
        }

        return successResponse(taskObj);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return handleError(error);
    }
}
