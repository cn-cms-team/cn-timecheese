export const dynamic = 'force-dynamic';

const healthPayload = () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: Math.floor(process.uptime()),
});

const createHealthResponse = () =>
  Response.json(healthPayload(), {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });

export async function GET() {
  return createHealthResponse();
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
