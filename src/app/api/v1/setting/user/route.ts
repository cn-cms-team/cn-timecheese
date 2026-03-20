import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

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
        is_active: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
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
    return Response.json({ data: userMaps }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // check if email already exists
    const body = await request.json();
    const existingUser = await prisma.user.findUnique({
      where: { email: body.data.email, is_enabled: true },
      select: { id: true },
    });
    if (existingUser) {
      return Response.json({ message: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.data.password, 10);

    const result = await prisma.user.create({
      data: { ...body.data, password: hashedPassword, created_by: session?.user.id },
    });

    return Response.json(
      {
        message: 'Created successfully',
        data: { id: result.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
