import { auth } from '@/auth';
import prisma from '@/lib/prisma';

type WebPushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const isValidSubscription = (value: unknown): value is WebPushSubscription => {
  if (!value || typeof value !== 'object') return false;
  const subscription = value as Record<string, unknown>;
  const keys = subscription.keys as Record<string, unknown> | undefined;

  return (
    typeof subscription.endpoint === 'string' &&
    (subscription.expirationTime === null || typeof subscription.expirationTime === 'number') &&
    !!keys &&
    typeof keys.p256dh === 'string' &&
    typeof keys.auth === 'string'
  );
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    if (!isValidSubscription(body)) {
      return Response.json({ message: 'Invalid subscription payload' }, { status: 400 });
    }

    const expirationTime =
      body.expirationTime === null ? null : BigInt(Math.trunc(body.expirationTime));

    await prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      create: {
        user_id: session.user.id,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        expiration_time: expirationTime,
        is_enabled: true,
      },
      update: {
        user_id: session.user.id,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        expiration_time: expirationTime,
        is_enabled: true,
        updated_at: new Date(),
      },
    });

    return Response.json({ message: 'Subscription saved' }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const endpoint = (body as { endpoint?: string })?.endpoint;
    if (!endpoint) {
      return Response.json({ message: 'Missing endpoint' }, { status: 400 });
    }

    await prisma.pushSubscription.updateMany({
      where: {
        endpoint,
        user_id: session.user.id,
      },
      data: {
        is_enabled: false,
        updated_at: new Date(),
      },
    });

    return Response.json({ message: 'Subscription disabled' }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
