import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching holidays from database...');
    const holidays = await prisma.holiday.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        name: true,
        description: true,
        date: true,
      },
      orderBy: [{ date: 'desc' }, { name: 'asc' }],
    });

    console.log('Fetched holidays:', holidays);

    return Response.json({ data: holidays }, { status: 200 });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
