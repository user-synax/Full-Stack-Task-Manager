import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { loginSchema } from '@/utils/validation';
import { handleError, errorResponse } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT
    const token = generateToken(user._id.toString());

    // Create response and set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email },
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
