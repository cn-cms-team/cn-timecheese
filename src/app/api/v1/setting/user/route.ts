import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        nick_name: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        position_level: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    const userMaps = users.map((user) => {
      return {
        ...user,
        fullName: [user.first_name, user.last_name].join(' ').trim(),
      };
    });
    return Response.json({ data: userMaps, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body.data);

    const result = await prisma.user.create({
      data: { ...body.data },
    });

    return Response.json(
      {
        message: 'Create successfully',
        data: { id: result.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
