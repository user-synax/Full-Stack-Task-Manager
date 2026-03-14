import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { encrypt, decrypt } from '@/lib/crypto';
import { getAuthSession } from '@/middleware/auth';
import { taskSchema } from '@/utils/validation';
import { handleError, successResponse, errorResponse } from '@/utils/errorHandler';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const userId = await getAuthSession(req);
    const body = await req.json();

    // Validate input
    const validatedData = taskSchema.parse(body);

    // Check if task exists and belongs to user
    const task = await Task.findOne({ _id: params.id, userId });
    if (!task) {
      return errorResponse('Task not found or unauthorized', 404);
    }

    // Encrypt description if updated
    const encryptedDescription = encrypt(validatedData.description);

    // Update task
    task.title = validatedData.title;
    task.description = encryptedDescription;
    if (validatedData.status) {
      task.status = validatedData.status as any;
    }
    await task.save();

    const taskObj = task.toObject();
    taskObj.description = decrypt(taskObj.description);

    return successResponse(taskObj);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const userId = await getAuthSession(req);

    // Check if task exists and belongs to user
    const task = await Task.findOneAndDelete({ _id: params.id, userId });
    if (!task) {
      return errorResponse('Task not found or unauthorized', 404);
    }

    return successResponse({ message: 'Task deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    return handleError(error);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const userId = await getAuthSession(req);

    const task = await Task.findOne({ _id: params.id, userId });
    if (!task) {
      return errorResponse('Task not found or unauthorized', 404);
    }

    const taskObj = task.toObject();
    try {
      taskObj.description = decrypt(taskObj.description);
    } catch (err) {
      console.error('Decryption failed for task', taskObj._id);
      taskObj.description = 'Error decrypting description';
    }

    return successResponse(taskObj);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    return handleError(error);
  }
}
