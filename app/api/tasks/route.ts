import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { encrypt, decrypt } from '@/lib/crypto';
import { getAuthSession } from '@/middleware/auth';
import { taskSchema } from '@/utils/validation';
import { handleError, successResponse, errorResponse } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getAuthSession(req);
    const body = await req.json();

    // Validate input
    const validatedData = taskSchema.parse(body);

    // Encrypt description
    const encryptedDescription = encrypt(validatedData.description);

    // Create task
    const task = await Task.create({
      title: validatedData.title,
      description: encryptedDescription,
      status: validatedData.status || 'pending',
      userId,
    });

    return successResponse(task, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getAuthSession(req);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = { userId };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    // Decrypt descriptions for returned tasks
    const decryptedTasks = tasks.map((task) => {
      const taskObj = task.toObject();
      try {
        taskObj.description = decrypt(taskObj.description);
      } catch (err) {
        console.error('Decryption failed for task', taskObj._id);
        taskObj.description = 'Error decrypting description';
      }
      return taskObj;
    });

    return successResponse({
      tasks: decryptedTasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    return handleError(error);
  }
}
