import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getBannerConfig, BannerConfig } from "@/data/bannerConfig";

const WAIT_SECONDS = 5;
const seenKey = (banner: BannerConfig) => `quecomer-promo-seen:${banner.id || "promo"}:${banner.updatedAt || banner.image.length}`;

const PromoBanner = () => {
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const config = await getBannerConfig();
      if (!active) return;
      const alreadySeen = sessionStorage.getItem(seenKey(config)) === "1";
      if (config.enabled && config.image && !alreadySeen) {
        setBanner((current) => {
          if (current?.id === config.id && current.updatedAt === config.updatedAt && current.image === config.image) {
            return current;
          }
          return config;
        });
      } else {
        setBanner(null);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!banner) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [banner]);

  const bannerKey = banner ? `${banner.id}:${banner.updatedAt}` : "";

  useEffect(() => {
    if (bannerKey) setSecondsLeft(WAIT_SECONDS);
  }, [bannerKey]);

  useEffect(() => {
    if (!banner || secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [banner, secondsLeft]);

  if (!banner) return null;

  const canClose = secondsLeft <= 0;

  const close = () => {
    if (!canClose) return;
    sessionStorage.setItem(seenKey(banner), "1");
    setBanner(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#262826]" role="dialog" aria-modal="true" aria-label="Promoción">
      <img src={banner.image} alt="Promoción" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={close}
        disabled={!canClose}
        aria-label={canClose ? "Cerrar promoción" : `Puedes cerrar en ${secondsLeft} segundos`}
        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e6d7c8] text-lg font-semibold text-[#262826] shadow-lg disabled:cursor-default"
        style={{ marginTop: "env(safe-area-inset-top)" }}
      >
        {canClose ? <X className="h-6 w-6" /> : secondsLeft}
      </button>
    </div>
  );
};

export default PromoBanner;
