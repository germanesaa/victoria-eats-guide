// Visual meta (emoji + soft tile color) for restaurant categories.
// Shared between the home page tiles and the restaurant cards so the
// same icons are used everywhere.
export const CATEGORY_META: Record<string, { emoji: string; bg: string; anim: string }> = {
  all: { emoji: "🍽️", bg: "bg-emerald-200/70 dark:bg-emerald-900/50", anim: "pop" },
  pizza: { emoji: "🍕", bg: "bg-orange-200/80 dark:bg-orange-900/50", anim: "spin" },
  pizzas: { emoji: "🍕", bg: "bg-orange-200/80 dark:bg-orange-900/50", anim: "spin" },
  hamburguesa: { emoji: "🍔", bg: "bg-amber-200/80 dark:bg-amber-900/50", anim: "bounce" },
  hamburguesas: { emoji: "🍔", bg: "bg-amber-200/80 dark:bg-amber-900/50", anim: "bounce" },
  burger: { emoji: "🍔", bg: "bg-amber-200/80 dark:bg-amber-900/50", anim: "bounce" },
  sushi: { emoji: "🍣", bg: "bg-pink-200/80 dark:bg-pink-900/50", anim: "wiggle" },
  pasta: { emoji: "🍝", bg: "bg-slate-200/80 dark:bg-slate-700/50", anim: "swing" },
  pastas: { emoji: "🍝", bg: "bg-slate-200/80 dark:bg-slate-700/50", anim: "swing" },
  ensalada: { emoji: "🥗", bg: "bg-lime-200/80 dark:bg-lime-900/50", anim: "shake" },
  ensaladas: { emoji: "🥗", bg: "bg-lime-200/80 dark:bg-lime-900/50", anim: "shake" },
  postre: { emoji: "🍰", bg: "bg-rose-200/80 dark:bg-rose-900/50", anim: "pulse" },
  postres: { emoji: "🍰", bg: "bg-rose-200/80 dark:bg-rose-900/50", anim: "pulse" },
  pasteleria: { emoji: "🧁", bg: "bg-rose-200/80 dark:bg-rose-900/50", anim: "pulse" },
  "pastelería": { emoji: "🧁", bg: "bg-rose-200/80 dark:bg-rose-900/50", anim: "pulse" },
  bebida: { emoji: "🥤", bg: "bg-sky-200/80 dark:bg-sky-900/50", anim: "tilt" },
  bebidas: { emoji: "🥤", bg: "bg-sky-200/80 dark:bg-sky-900/50", anim: "tilt" },
  cafe: { emoji: "☕", bg: "bg-amber-100/80 dark:bg-amber-950/50", anim: "steam" },
  "café": { emoji: "☕", bg: "bg-amber-100/80 dark:bg-amber-950/50", anim: "steam" },
  desayuno: { emoji: "🥐", bg: "bg-yellow-200/80 dark:bg-yellow-900/50", anim: "swing" },
  desayunos: { emoji: "🥐", bg: "bg-yellow-200/80 dark:bg-yellow-900/50", anim: "swing" },
  mariscos: { emoji: "🦐", bg: "bg-cyan-200/80 dark:bg-cyan-900/50", anim: "swim" },
  mexicana: { emoji: "🌮", bg: "bg-red-200/80 dark:bg-red-900/50", anim: "shake" },
  pollo: { emoji: "🍗", bg: "bg-orange-100/80 dark:bg-orange-950/50", anim: "flap" },
  pollos: { emoji: "🍗", bg: "bg-orange-100/80 dark:bg-orange-950/50", anim: "flap" },
  parrilla: { emoji: "🥩", bg: "bg-red-300/70 dark:bg-red-950/50", anim: "heat" },
  asiatica: { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50", anim: "wiggle" },
  "asiática": { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50", anim: "wiggle" },
  "comida china": { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50", anim: "wiggle" },
  vegana: { emoji: "🥬", bg: "bg-green-200/80 dark:bg-green-900/50", anim: "grow" },
  vegetariana: { emoji: "🥦", bg: "bg-green-200/80 dark:bg-green-900/50", anim: "grow" },
  helado: { emoji: "🍦", bg: "bg-pink-100/80 dark:bg-pink-950/50", anim: "melt" },
  helados: { emoji: "🍦", bg: "bg-pink-100/80 dark:bg-pink-950/50", anim: "melt" },
};

export const getCategoryMeta = (cat: string) => {
  const key = cat.toLowerCase();
  return CATEGORY_META[key] ?? { emoji: "🍴", bg: "bg-muted/70", anim: "pop" };
};

// Returns the combined, de-duplicated, lowercase list of categories for a
// restaurant (primary + extra). Useful for filtering and display.
export const getAllCategories = (
  primary: string,
  extras?: string[] | null
): string[] => {
  const all = [primary, ...((extras as string[] | null | undefined) || [])]
    .map((c) => (c || "").trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(all));
};

// The full predefined catalog admins can pick from in the admin panel.
export const PREDEFINED_CATEGORIES: string[] = [
  "comida china",
  "pizza",
  "hamburguesas",
  "parrilla",
  "sushi",
  "postres",
  "pastelería",
  "café",
  "mariscos",
  "pollos",
  "pasta",
  "ensaladas",
  "bebidas",
  "desayunos",
  "mexicana",
  "asiática",
  "vegana",
  "vegetariana",
  "helados",
];