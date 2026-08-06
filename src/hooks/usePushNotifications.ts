import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VAPID_PUBLIC_KEY =
  "BJwTVRzUwildS9-0nrZWaFHyxWKYRX9F8DUMJYqNGy97hhb74U4gZ08FJbXA8nYjQF7ITP6beQhuJ3NGrHxbWBI";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer | null) => {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

export const isPushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

export const usePushNotifications = () => {
  const [supported] = useState(isPushSupported());
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker
      .getRegistration("/push-sw.js")
      .then((reg) => reg?.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => setSubscribed(false));
  }, [supported]);

  const subscribe = useCallback(async () => {
    if (!supported) return false;
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;

      const registration = await navigator.serviceWorker.register("/push-sw.js");
      await navigator.serviceWorker.ready;

      let sub = await registration.pushManager.getSubscription();
      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
      await supabase.from("push_subscriptions" as any).upsert(
        {
          endpoint: json.endpoint || sub.endpoint,
          p256dh: json.keys?.p256dh || arrayBufferToBase64(sub.getKey("p256dh")),
          auth: json.keys?.auth || arrayBufferToBase64(sub.getKey("auth")),
          user_agent: navigator.userAgent.slice(0, 255),
        } as any,
        { onConflict: "endpoint", ignoreDuplicates: true } as any
      );

      setSubscribed(true);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    if (!supported) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
      const sub = await reg?.pushManager.getSubscription();
      await sub?.unsubscribe();
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [supported]);

  return { supported, permission, subscribed, loading, subscribe, unsubscribe };
};
