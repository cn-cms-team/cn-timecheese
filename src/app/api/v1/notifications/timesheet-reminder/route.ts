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

    const submittedUsers = await prisma.timeSheetSummary.findMany({
      where: {
        sum_date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        user_id: true,
      },
      distinct: ['user_id'],
    });

    const submittedUserIds = submittedUsers.map((summary) => summary.user_id);

    const targets = await prisma.pushSubscription.findMany({
      where: {
        is_enabled: true,
        user: {
          is_enabled: true,
        },
        user_id: {
          notIn: submittedUserIds,
        },
      },
      select: {
        id: true,
        endpoint: true,
        p256dh: true,
        auth: true,
      },
    });

    const payload: NotificationPayload = {
      title: 'แจ้งเตือน Time Sheet',
      body: 'อย่าลืมกรอก Time Sheet วันนี้ก่อนเลิกงานนะคะพี่ๆ',
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
          await prisma.pushSubscription.updateMany({
            where: {
              id: subscription.id,
            },
            data: {
              is_enabled: false,
              updated_at: new Date(),
            },
          });
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
