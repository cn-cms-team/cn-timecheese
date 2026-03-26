This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Install Infisical

```
npm install @infisical/cli -g
```

## Login & Run Infisical

```
infisical login

infisical run -- npm run dev
```

## Timesheet Push Reminder Setup

This project supports push reminder notifications for weekdays at 17:50 (Asia/Bangkok).

### 1) Required environment variables

Set these values in your environment (or Infisical):

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your_vapid_public_key>
VAPID_PRIVATE_KEY=<your_vapid_private_key>
VAPID_SUBJECT=mailto:you@example.com
NOTIFICATION_CRON_SECRET=<random_secret>
```

If you deploy on Vercel Cron, you can use `CRON_SECRET` instead of `NOTIFICATION_CRON_SECRET`.

### 2) Run DB migration

Apply the migration so `push_subscriptions` table exists:

```bash
npx prisma migrate deploy
```

### 3) Generate VAPID keys (one-time)

```bash
npx web-push generate-vapid-keys
```

### 4) Browser permission

After login, the app registers service worker and requests notification permission.
Users must allow notifications once on their browser.

### 5) Cron schedule

For Vercel, `vercel.json` is configured to call:

`/api/v1/notifications/timesheet-reminder` on `50 10 * * 1-5` (UTC), which equals 17:50 Monday-Friday in Thailand.
