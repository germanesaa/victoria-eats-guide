import { useEffect, useState } from "react";
import { Bell, BellRing, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";

const DISMISS_KEY = "quecomer-push-dismissed";

const NotificationOptIn = () => {
  const { supported, permission, subscribed, loading, subscribe } = usePushNotifications();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const hide = !supported || subscribed || permission === "denied" || dismissed;
  if (hide) return null;

  const handleSubscribe = async () => {
    const ok = await subscribe();
    toast(
      ok
        ? { title: "¡Listo!", description: "Te avisaremos de las promociones." }
        : { title: "No se activaron", description: "Permite las notificaciones en tu navegador.", variant: "destructive" }
    );
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-24 left-3 right-3 z-[60] mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-3 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BellRing className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Recibe promociones</p>
          <p className="text-xs text-muted-foreground">
            Activa las notificaciones y entérate primero de los descuentos.
          </p>
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={loading}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:brightness-105 disabled:opacity-60"
          >
            <Bell className="h-3.5 w-3.5" />
            {loading ? "Activando..." : "Activar notificaciones"}
          </button>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="flex-shrink-0 rounded-full p-1 text-muted-foreground transition hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationOptIn;
