export type ThemeMode = "light" | "dark";

export type StoredReview = {
  id: string;
  restaurantId: string;
  name: string;
  comment: string;
  stars: number;
  updatedAt: number;
};

const FAVORITES_KEY = "quecomer-favorites";
const REVIEWS_KEY = "quecomer-reviews";
const THEME_KEY = "quecomer-theme";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFavorites = (): string[] => read<string[]>(FAVORITES_KEY, []);

export const saveFavorites = (ids: string[]) => write(FAVORITES_KEY, ids);

export const loadReviews = (): StoredReview[] => read<StoredReview[]>(REVIEWS_KEY, []);

export const saveReviews = (reviews: StoredReview[]) => write(REVIEWS_KEY, reviews);

export const loadTheme = (): ThemeMode => {
  const value = localStorage.getItem(THEME_KEY);
  return value === "dark" ? "dark" : "light";
};

export const applyTheme = (mode: ThemeMode) => {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem(THEME_KEY, mode);
};
