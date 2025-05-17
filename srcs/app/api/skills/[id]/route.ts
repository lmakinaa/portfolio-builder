import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: any
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify skill belongs to user's portfolio
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: {
          include: {
            skills: true,
          },
        },
      },
    });

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const skillExists = user.portfolio.skills.some((s: any) => s.id === id);
    if (!skillExists) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: any
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();
    const { category, items } = data;

    // Verify skill belongs to user's portfolio
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: {
          include: {
            skills: true,
          },
        },
      },
    });

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const skillExists = user.portfolio.skills.some((s: any) => s.id === id);
    if (!skillExists) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        category,
        items,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
