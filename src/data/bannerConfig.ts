import { supabase } from "@/integrations/supabase/client";

export interface BannerConfig {
  id?: string;
  enabled: boolean;
  text: string;
  image: string;
  linkUrl?: string;
  linkText?: string;
  scheduleStart?: string | null;
  scheduleEnd?: string | null;
}

const defaultBanner: BannerConfig = {
  enabled: false,
  text: "",
  image: "",
  linkUrl: "",
  linkText: "",
  scheduleStart: null,
  scheduleEnd: null,
};

export const getBannerConfig = async (): Promise<BannerConfig> => {
  try {
    const { data, error } = await supabase
      .from("banner_config" as any)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return defaultBanner;

    const row = data as any;
    return {
      id: row.id,
      enabled: row.enabled,
      text: row.text || "",
      image: row.image || "",
      linkUrl: row.link_url || "",
      linkText: row.link_text || "",
      scheduleStart: row.schedule_start || null,
      scheduleEnd: row.schedule_end || null,
    };
  } catch {
    return defaultBanner;
  }
};

export const saveBannerConfig = async (config: BannerConfig): Promise<void> => {
  const payload = {
    enabled: config.enabled,
    text: config.text,
    image: config.image,
    link_url: config.linkUrl || "",
    link_text: config.linkText || "",
    schedule_start: config.scheduleStart || null,
    schedule_end: config.scheduleEnd || null,
    updated_at: new Date().toISOString(),
  };

  if (config.id) {
    await supabase
      .from("banner_config" as any)
      .update(payload as any)
      .eq("id", config.id);
  } else {
    await supabase
      .from("banner_config" as any)
      .insert(payload as any);
  }
};

export const isBannerInSchedule = (config: BannerConfig): boolean => {
  if (!config.scheduleStart && !config.scheduleEnd) return true;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTime = (t: string | null | undefined): number | null => {
    if (!t) return null;
    const parts = t.split(":");
    if (parts.length < 2) return null;
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const start = parseTime(config.scheduleStart);
  const end = parseTime(config.scheduleEnd);

  if (start !== null && end !== null) {
    if (start <= end) {
      return currentMinutes >= start && currentMinutes <= end;
    }
    // Overnight range (e.g., 22:00 - 06:00)
    return currentMinutes >= start || currentMinutes <= end;
  }
  if (start !== null) return currentMinutes >= start;
  if (end !== null) return currentMinutes <= end;

  return true;
};
