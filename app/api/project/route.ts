import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: {
          include: {
            projects: true,
          },
        },
      },
    });

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json(user.portfolio.projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, imageUrl, githubUrl, demoUrl, technologies } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: true,
      },
    });

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        portfolioId: user.portfolio.id,
        title,
        description,
        imageUrl,
        githubUrl,
        demoUrl,
        technologies,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, title, description, imageUrl, githubUrl, demoUrl, technologies } = data;

    // Verify project belongs to user's portfolio
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: {
          include: {
            projects: true,
          },
        },
      },
    });

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const projectExists = user.portfolio.projects.some((p: any) => p.id === id);
    if (!projectExists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        githubUrl,
        demoUrl,
        technologies,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Verify project belongs to user's portfolio
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: {
          include: {
            projects: true,
          },
        },
      },
    });

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const projectExists = user.portfolio.projects.some((p: any) => p.id === id);
    if (!projectExists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 