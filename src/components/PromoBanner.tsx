import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getBannerConfig, BannerConfig } from "@/data/bannerConfig";

const PromoBanner = () => {
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const config = getBannerConfig();
    if (config.enabled && (config.text || config.image)) {
      setBanner(config);
    }
  }, []);

  if (!banner || dismissed) return null;

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden mx-4 mb-6">
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
        aria-label="Cerrar banner"
      >
        <X className="w-4 h-4" />
      </button>

      {banner.image && (
        <div className="w-full h-40 sm:h-52 overflow-hidden">
          <img
            src={banner.image}
            alt="Promoción"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {banner.text && (
        <div className="p-4 text-center">
          <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed">
            {banner.text}
          </p>
          {banner.linkUrl && banner.linkText && (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
            >
              {banner.linkText}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default PromoBanner;
