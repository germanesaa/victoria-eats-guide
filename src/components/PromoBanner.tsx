import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getBannerConfig, isBannerInSchedule, BannerConfig, BannerSize } from "@/data/bannerConfig";

const PromoBanner = () => {
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      const config = await getBannerConfig();
      if (config.enabled && (config.text || config.image) && isBannerInSchedule(config)) {
        setBanner(config);
      } else {
        setBanner(null);
      }
    };

    fetchBanner();

    const interval = setInterval(fetchBanner, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!banner || dismissed) return null;

  const sizeClasses: Record<BannerSize, string> = {
    small: "py-1",
    medium: "py-2",
    large: "py-3",
  };

  return (
    <div className={`relative glass-card overflow-hidden mx-4 mb-2 rounded-xl ${sizeClasses[banner.size]}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-1 right-1 z-10 p-0.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
        aria-label="Cerrar banner"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-center justify-center gap-2 px-6">
        {banner.image && (
          <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={banner.image}
              alt="Promoción"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {banner.text && (
          <div className="text-center">
            <p className="text-foreground font-medium text-xs sm:text-sm leading-tight line-clamp-1">
              {banner.text}
            </p>
            {banner.linkUrl && banner.linkText && (() => {
              let safeUrl = '#';
              try {
                const parsed = new URL(banner.linkUrl);
                const protocol = parsed.protocol.toLowerCase();
                if (protocol === 'http:' || protocol === 'https:') {
                  safeUrl = parsed.href;
                }
              } catch { /* invalid URL, use # */ }
              return (
                <a
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
                >
                  {banner.linkText}
                </a>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;
