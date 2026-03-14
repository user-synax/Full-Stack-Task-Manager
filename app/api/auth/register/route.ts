import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/utils/validation';
import { handleError, successResponse } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
    });

    return successResponse(
      { id: user._id, name: user.name, email: user.email },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}
