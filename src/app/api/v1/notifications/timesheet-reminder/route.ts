import prisma from '@/lib/prisma';
import { getThaiDateString, parseDate, toUtcDayBounds } from '@/lib/functions/date-format';
import webpush from 'web-push';

const THAI_TIMEZONE = 'Asia/Bangkok';

type NotificationPayload = {
  title: string;
  body: string;
  url: string;
  tag: string;
};

const getTodayRange = () => {
  const todayInBangkok = getThaiDateString(new Date());
  const parsedDate = parseDate(todayInBangkok);
  if (!parsedDate) {
    throw new Error('Cannot parse current date in Asia/Bangkok timezone');
  }

  return toUtcDayBounds(parsedDate, parsedDate);
};

const isBusinessDayInBangkok = () => {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: THAI_TIMEZONE,
    weekday: 'short',
  }).format(new Date());

  return weekday !== 'Sat' && weekday !== 'Sun';
};

const ensureVapidConfig = () => {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    throw new Error('Missing VAPID environment variables');
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.NOTIFICATION_CRON_SECRET || process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!isBusinessDayInBangkok()) {
      return Response.json({ message: 'Skip weekend' }, { status: 200 });
    }

    ensureVapidConfig();

    const { start, end } = getTodayRange();

    type PushTarget = {
      id: string;
      endpoint: string;
      p256dh: string;
      auth: string;
    };

    const targets = await prisma.$queryRaw<PushTarget[]>`
      SELECT ps.id, ps.endpoint, ps.p256dh, ps.auth
      FROM push_subscriptions ps
      INNER JOIN users u ON u.id = ps.user_id
      LEFT JOIN (
        SELECT DISTINCT user_id
        FROM time_sheet_summaries
        WHERE sum_date >= ${start}
          AND sum_date <= ${end}
      ) submitted ON submitted.user_id = ps.user_id
      WHERE ps.is_enabled = true
        AND u.is_enabled = true
        AND submitted.user_id IS NULL
    `;

    const payload: NotificationPayload = {
      title: 'แจ้งเตือน Time Sheet',
      body: 'อย่าลืมกรอก Time Sheet วันนี้ก่อนเลิกงานนะครับ',
      url: '/timesheet',
      tag: 'timesheet-reminder-weekday-1750',
    };

    let success = 0;
    let disabled = 0;

    for (const subscription of targets) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload)
        );
        success += 1;
      } catch (error) {
        const statusCode =
          typeof error === 'object' && error !== null && 'statusCode' in error
            ? Number((error as { statusCode: number }).statusCode)
            : null;

        if (statusCode === 404 || statusCode === 410) {
          await prisma.$executeRaw`
            UPDATE push_subscriptions
            SET is_enabled = false,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${subscription.id}::uuid
          `;
          disabled += 1;
          continue;
        }

        console.error('Failed to send push notification:', error);
      }
    }

    return Response.json(
      {
        message: 'Notification job completed',
        targets: targets.length,
        success,
        disabled,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
