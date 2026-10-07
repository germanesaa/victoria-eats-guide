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

const waitForActive = (registration: ServiceWorkerRegistration) => {
  if (registration.active) return Promise.resolve(registration);
  const worker = registration.installing || registration.waiting;
  if (!worker) return Promise.resolve(registration);
  return new Promise<ServiceWorkerRegistration>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("El servicio de notificaciones no arrancó.")), 8000);
    worker.addEventListener("statechange", () => {
      if (worker.state === "activated") {
        window.clearTimeout(timer);
        resolve(registration);
      }
      if (worker.state === "redundant") {
        window.clearTimeout(timer);
        reject(new Error("No se pudo preparar las notificaciones."));
      }
    });
  });
};

const ensureRegistration = async () => {
  const existing = await findRegistration();
  const registration = existing ?? (await navigator.serviceWorker.register(SW_URL));
  return waitForActive(registration);
};

export type PushResult = { ok: boolean; message: string };

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
        const reg = await ensureRegistration();
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

  const subscribe = useCallback(async (): Promise<PushResult> => {
    if (!supported) {
      const message =
        isIOS() && !isStandalone()
          ? "En iPhone, instala la app y ábrela desde el ícono para activar las notificaciones."
          : "Este navegador no permite notificaciones.";
      setError(message);
      return { ok: false, message };
    }
    setLoading(true);
    setError(null);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        const message =
          perm === "denied"
            ? "Las notificaciones están bloqueadas. Actívalas en los ajustes del navegador."
            : "Hay que permitir las notificaciones para activarlas.";
        setError(message);
        return { ok: false, message };
      }

      const registration = await ensureRegistration();

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
      const { error: dbError } = await supabase.from("push_subscriptions" as any).insert({
        endpoint: json.endpoint || sub.endpoint,
        p256dh: json.keys?.p256dh || arrayBufferToBase64Url(sub.getKey("p256dh")),
        auth: json.keys?.auth || arrayBufferToBase64Url(sub.getKey("auth")),
        user_agent: navigator.userAgent.slice(0, 255),
      } as any);
      const alreadySaved = (dbError as { code?: string } | null)?.code === "23505";
      if (dbError && !alreadySaved) {
        const message = "No se pudo guardar este teléfono. Inténtalo de nuevo.";
        setError(message);
        return { ok: false, message };
      }

      setSubscribed(true);
      return { ok: true, message: "Te avisaremos de las promociones." };
    } catch (e) {
      const raw = e instanceof Error ? e.message : "";
      const message = /push service not available/i.test(raw)
        ? "Este navegador no puede recibir avisos. Ábrelo en Chrome del teléfono o instala la app."
        : raw || "No se pudieron activar las notificaciones.";
      setError(message);
      return { ok: false, message };
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
