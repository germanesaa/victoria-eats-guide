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

    // Re-check every minute for schedule changes
    const interval = setInterval(fetchBanner, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!banner || dismissed) return null;

  const isSticky = banner.size === "small";
  const imageHeight = banner.size === "large" ? "h-52 sm:h-72" : banner.size === "small" ? "h-20 sm:h-24" : "h-40 sm:h-52";

  const content = (
    <div className={`relative glass-card rounded-2xl overflow-hidden ${isSticky ? "" : "mx-4 mb-6"}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
        aria-label="Cerrar banner"
      >
        <X className="w-4 h-4" />
      </button>

      {banner.image && (
        <div className={`w-full ${imageHeight} overflow-hidden`}>
          <img
            src={banner.image}
            alt="Promoción"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {banner.text && (
        <div className={`${banner.size === "small" ? "p-2 px-3" : "p-4"} text-center`}>
          <p className={`text-foreground font-medium leading-relaxed ${banner.size === "small" ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}>
            {banner.text}
          </p>
          {banner.linkUrl && banner.linkText && (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block mt-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors ${banner.size === "small" ? "text-xs" : "text-sm"}`}
            >
              {banner.linkText}
            </a>
          )}
        </div>
      )}
    </div>
  );

  if (isSticky) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto shadow-2xl">
        {content}
      </div>
    );
  }

  return content;
};

export default PromoBanner;
