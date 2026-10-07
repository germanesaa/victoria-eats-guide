/* Service worker dedicado a notificaciones push (QuéComer).
   No cachea la app — solo maneja push y clicks. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request));
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "QuéComer", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "QuéComer";
  const options = {
    body: data.body || "",
    icon: data.icon || "/icon-192.png",
    badge: "/icon-192.png",
    image: data.image || undefined,
    data: { url: data.url || "/" },
    vibrate: [80, 40, 80],
    tag: data.tag || "quecomer-promo",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of all) {
        if ("focus" in client) {
          try { await client.navigate(target); } catch { /* ignore */ }
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })(),
  );
});
