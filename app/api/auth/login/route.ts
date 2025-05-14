import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
        
      return NextResponse.json(
        { error: 'Email or password not valid' },
        { status: 401 }
      );
    }

    // Hash password
    const isPasswordValid = await bcrypt.compare(password, existingUser.hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email or password not valid' },
        { status: 401 }
      );
    }
    
    const token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '8h' }
    );

    return NextResponse.json(
        { token },
        { status: 200 }
    );

    // Return success response without sensitive data
   } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
        { error: 'An error has happened during processing your request' },
        { status: 412 }
    );
   }
} 