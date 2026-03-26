self.addEventListener('push', (event) => {
  const fallbackPayload = {
    title: 'Time Sheet Reminder',
    body: 'Please fill your time sheet today.',
    url: '/timesheet',
    tag: 'timesheet-reminder',
  };

  let payload = fallbackPayload;
  if (event.data) {
    try {
      payload = { ...fallbackPayload, ...event.data.json() };
    } catch {
      payload = fallbackPayload;
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: payload.url,
      },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const url = event.notification.data?.url || '/timesheet';

      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});
