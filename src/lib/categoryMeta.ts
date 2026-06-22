// Visual meta (emoji + soft tile color) for restaurant categories.
// Shared between the home page tiles and the restaurant cards so the
// same icons are used everywhere.
export const CATEGORY_META: Record<string, { emoji: string; bg: string }> = {
  all: { emoji: "🍽️", bg: "bg-emerald-200/70 dark:bg-emerald-900/50" },
  pizza: { emoji: "🍕", bg: "bg-orange-200/80 dark:bg-orange-900/50" },
  pizzas: { emoji: "🍕", bg: "bg-orange-200/80 dark:bg-orange-900/50" },
  hamburguesa: { emoji: "🍔", bg: "bg-amber-200/80 dark:bg-amber-900/50" },
  hamburguesas: { emoji: "🍔", bg: "bg-amber-200/80 dark:bg-amber-900/50" },
  burger: { emoji: "🍔", bg: "bg-amber-200/80 dark:bg-amber-900/50" },
  sushi: { emoji: "🍣", bg: "bg-pink-200/80 dark:bg-pink-900/50" },
  pasta: { emoji: "🍝", bg: "bg-slate-200/80 dark:bg-slate-700/50" },
  pastas: { emoji: "🍝", bg: "bg-slate-200/80 dark:bg-slate-700/50" },
  ensalada: { emoji: "🥗", bg: "bg-lime-200/80 dark:bg-lime-900/50" },
  ensaladas: { emoji: "🥗", bg: "bg-lime-200/80 dark:bg-lime-900/50" },
  postre: { emoji: "🍰", bg: "bg-rose-200/80 dark:bg-rose-900/50" },
  postres: { emoji: "🍰", bg: "bg-rose-200/80 dark:bg-rose-900/50" },
  pasteleria: { emoji: "🧁", bg: "bg-rose-200/80 dark:bg-rose-900/50" },
  "pastelería": { emoji: "🧁", bg: "bg-rose-200/80 dark:bg-rose-900/50" },
  bebida: { emoji: "🥤", bg: "bg-sky-200/80 dark:bg-sky-900/50" },
  bebidas: { emoji: "🥤", bg: "bg-sky-200/80 dark:bg-sky-900/50" },
  cafe: { emoji: "☕", bg: "bg-amber-100/80 dark:bg-amber-950/50" },
  "café": { emoji: "☕", bg: "bg-amber-100/80 dark:bg-amber-950/50" },
  desayuno: { emoji: "🥐", bg: "bg-yellow-200/80 dark:bg-yellow-900/50" },
  desayunos: { emoji: "🥐", bg: "bg-yellow-200/80 dark:bg-yellow-900/50" },
  mariscos: { emoji: "🦐", bg: "bg-cyan-200/80 dark:bg-cyan-900/50" },
  mexicana: { emoji: "🌮", bg: "bg-red-200/80 dark:bg-red-900/50" },
  pollo: { emoji: "🍗", bg: "bg-orange-100/80 dark:bg-orange-950/50" },
  pollos: { emoji: "🍗", bg: "bg-orange-100/80 dark:bg-orange-950/50" },
  parrilla: { emoji: "🥩", bg: "bg-red-300/70 dark:bg-red-950/50" },
  asiatica: { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50" },
  "asiática": { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50" },
  "comida china": { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50" },
  vegana: { emoji: "🥬", bg: "bg-green-200/80 dark:bg-green-900/50" },
  vegetariana: { emoji: "🥦", bg: "bg-green-200/80 dark:bg-green-900/50" },
  helado: { emoji: "🍦", bg: "bg-pink-100/80 dark:bg-pink-950/50" },
  helados: { emoji: "🍦", bg: "bg-pink-100/80 dark:bg-pink-950/50" },
};

export const getCategoryMeta = (cat: string) => {
  const key = cat.toLowerCase();
  return CATEGORY_META[key] ?? { emoji: "🍴", bg: "bg-muted/70" };
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