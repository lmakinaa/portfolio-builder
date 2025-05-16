import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// Helper function to get user from request headers
async function getUserFromHeader(request: Request) {
  const userId = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email');
  
  if (!userId || !email) {
    return null;
  }
  
  return { userId, email };
}

// POST /api/message - Create a new message
export async function POST(request: Request) {
  try {
    const user = await getUserFromHeader(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { senderEmail, subject, content } = body;
    
    if (!senderEmail || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const message = await prisma.message.create({
      data: {
        userId: user.userId,
        senderEmail,
        subject,
        content
      }
    });
    
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// GET /api/message - Get all messages for the authenticated user
export async function GET(request: Request) {
  try {
    const user = await getUserFromHeader(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const messages = await prisma.message.findMany({
      where: {
        userId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
