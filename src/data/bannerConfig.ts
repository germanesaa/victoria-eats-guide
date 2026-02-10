export interface BannerConfig {
  enabled: boolean;
  text: string;
  image: string;
  linkUrl?: string;
  linkText?: string;
}

const BANNER_STORAGE_KEY = "victoria-eats-banner";

const defaultBanner: BannerConfig = {
  enabled: false,
  text: "",
  image: "",
  linkUrl: "",
  linkText: "",
};

export const getBannerConfig = (): BannerConfig => {
  try {
    const stored = localStorage.getItem(BANNER_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultBanner;
};

export const saveBannerConfig = (config: BannerConfig): void => {
  localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(config));
};
