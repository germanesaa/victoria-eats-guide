import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Fallback: se sobreescribe con la clave real del backend al suscribirse.
export const VAPID_PUBLIC_KEY =
  "BJwTVRzUwildS9-0nrZWaFHyxWKYRX9F8DUMJYqNGy97hhb74U4gZ08FJbXA8nYjQF7ITP6beQhuJ3NGrHxbWBI";

const SW_URL = "/push-sw.js";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer | null) => {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const isPushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true);

const isIOS = () =>
  typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

const findRegistration = async () => {
  const regs = await navigator.serviceWorker.getRegistrations();
  return regs.find((r) => (r.active || r.installing || r.waiting)?.scriptURL.includes("push-sw.js"));
};

const fetchServerKey = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("push-public-key");
    const key = (data as any)?.key;
    if (!error && typeof key === "string" && key.length > 20) return key;
  } catch {
    /* usa fallback */
  }
  return VAPID_PUBLIC_KEY;
};

export const usePushNotifications = () => {
  // En iOS solo funciona con la app instalada en la pantalla de inicio.
  const [supported] = useState(isPushSupported() && (!isIOS() || isStandalone()));
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    (async () => {
      try {
        const reg = (await findRegistration()) ?? (await navigator.serviceWorker.register(SW_URL));
        const sub = await reg.pushManager.getSubscription();
        if (!cancelled) setSubscribed(!!sub);
      } catch {
        if (!cancelled) setSubscribed(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supported]);

  const subscribe = useCallback(async () => {
    if (!supported) return false;
    setLoading(true);
    setError(null);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setError("Permiso denegado");
        return false;
      }

      const registration = (await findRegistration()) ?? (await navigator.serviceWorker.register(SW_URL));
      await navigator.serviceWorker.ready;

      const serverKey = await fetchServerKey();

      let sub = await registration.pushManager.getSubscription();
      if (sub) {
        const current = arrayBufferToBase64Url(sub.options?.applicationServerKey ?? null);
        if (current && current !== serverKey) {
          // La clave cambió: recrear la suscripción.
          await sub.unsubscribe();
          sub = null;
        }
      }
      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(serverKey),
        });
      }

      const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
      const { error: dbError } = await supabase.from("push_subscriptions" as any).upsert(
        {
          endpoint: json.endpoint || sub.endpoint,
          p256dh: json.keys?.p256dh || arrayBufferToBase64Url(sub.getKey("p256dh")),
          auth: json.keys?.auth || arrayBufferToBase64Url(sub.getKey("auth")),
          user_agent: navigator.userAgent.slice(0, 255),
        } as any,
        { onConflict: "endpoint", ignoreDuplicates: true } as any
      );
      if (dbError) {
        setError(dbError.message);
        return false;
      }

      setSubscribed(true);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    if (!supported) return;
    setLoading(true);
    try {
      const reg = await findRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await supabase.from("push_subscriptions" as any).delete().eq("endpoint", sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [supported]);

  return { supported, permission, subscribed, loading, error, subscribe, unsubscribe };
};
