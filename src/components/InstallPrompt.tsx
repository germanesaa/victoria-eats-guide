import { useEffect, useState } from "react";
import { X, Share, Plus } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "quecomer-install-dismissed";

const InstallPrompt = () => {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    const recentlyDismissed = dismissedAt && Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore iOS Safari
      window.navigator.standalone === true;
    if (standalone || recentlyDismissed) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIOS(iOS);

    if (iOS) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const close = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-28 left-4 right-4 z-[60]">
      <div className="bg-card rounded-2xl shadow-2xl border border-border/60 p-4 flex gap-3 items-start">
        <img
          src="/brand/mark-original.png"
          alt=""
          className="w-11 h-11 rounded-xl bg-white object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-tight">
            Instala QuéComer
          </p>
          {isIOS ? (
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              Toca <Share className="inline w-3.5 h-3.5 mx-0.5 align-text-bottom" /> y luego
              <span className="font-medium"> Añadir a pantalla de inicio </span>
              <Plus className="inline w-3.5 h-3.5 align-text-bottom" />
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              Añádela a tu pantalla de inicio para acceso rápido.
            </p>
          )}
          {!isIOS && (
            <button
              onClick={install}
              className="mt-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm"
            >
              Instalar
            </button>
          )}
        </div>
        <button
          onClick={close}
          aria-label="Cerrar"
          className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center flex-shrink-0"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;