'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const normalized = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(normalized);
  const outputArray = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; ++i) {
    outputArray[i] = raw.charCodeAt(i);
  }

  return outputArray;
};

const PushNotificationBootstrap = () => {
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!('serviceWorker' in navigator)) return;
    if (!('PushManager' in window)) return;
    if (!VAPID_PUBLIC_KEY) return;

    let cancelled = false;

    const registerAndSubscribe = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        await navigator.serviceWorker.ready;

        let permission = Notification.permission;
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }
        if (permission !== 'granted' || cancelled) {
          return;
        }

        const existingSubscription = await registration.pushManager.getSubscription();
        const subscription =
          existingSubscription ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          }));

        await fetch('/api/v1/notifications/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      } catch (error) {
        console.error('Push registration failed:', error);
      }
    };

    void registerAndSubscribe();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return null;
};

export default PushNotificationBootstrap;
