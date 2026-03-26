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

    await prisma.$executeRaw`
      INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, expiration_time, is_enabled)
      VALUES (${crypto.randomUUID()}::uuid, ${session.user.id}::uuid, ${body.endpoint}, ${body.keys.p256dh}, ${body.keys.auth}, ${expirationTime}, true)
      ON CONFLICT (endpoint)
      DO UPDATE SET
        user_id = EXCLUDED.user_id,
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        expiration_time = EXCLUDED.expiration_time,
        is_enabled = true,
        updated_at = CURRENT_TIMESTAMP
    `;

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

    await prisma.$executeRaw`
      UPDATE push_subscriptions
      SET is_enabled = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE endpoint = ${endpoint}
        AND user_id = ${session.user.id}::uuid
    `;

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
