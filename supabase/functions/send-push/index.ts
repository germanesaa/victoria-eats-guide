import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@quecomer.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "No autorizado" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "No autorizado" }, 401);

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) return json({ error: "Requiere permisos de administrador" }, 403);

    const body = await req.json().catch(() => ({}));
    const title = String(body?.title ?? "").trim();
    const message = String(body?.body ?? "").trim();
    const url = String(body?.url ?? "/").trim() || "/";
    const image = String(body?.image ?? "").trim();

    if (!title || title.length > 100) return json({ error: "Título requerido (máx. 100 caracteres)" }, 400);
    if (!message || message.length > 300) return json({ error: "Mensaje requerido (máx. 300 caracteres)" }, 400);
    if (url !== "/" && !/^https?:\/\//.test(url) && !url.startsWith("/"))
      return json({ error: "URL no válida" }, 400);

    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const { data: subs } = await admin.from("push_subscriptions").select("id, endpoint, p256dh, auth");
    const payload = JSON.stringify({ title, body: message, url, image });

    let sent = 0;
    const stale: string[] = [];

    await Promise.all(
      (subs ?? []).map(async (s: any) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
          );
          sent++;
        } catch (err: any) {
          if (err?.statusCode === 404 || err?.statusCode === 410) stale.push(s.id);
        }
      }),
    );

    if (stale.length) await admin.from("push_subscriptions").delete().in("id", stale);

    const failed = (subs?.length ?? 0) - sent;
    await admin.from("push_notifications").insert({
      title,
      body: message,
      url,
      image,
      sent_count: sent,
      failed_count: failed,
      created_by: userData.user.id,
    });

    return json({ success: true, sent, failed, total: subs?.length ?? 0 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Error inesperado" }, 500);
  }
});
