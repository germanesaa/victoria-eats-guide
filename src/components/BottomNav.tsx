import { Flame, List, Search, Settings, Star } from "lucide-react";

export type AppTab = "favorites" | "directory" | "browse" | "trending" | "settings";

interface BottomNavProps {
  tab: AppTab;
  onChange: (tab: AppTab) => void;
}

const items: { id: AppTab; label: string; icon: typeof Star }[] = [
  { id: "favorites", label: "Favoritos", icon: Star },
  { id: "directory", label: "Directorio", icon: List },
  { id: "browse", label: "Buscar", icon: Search },
  { id: "trending", label: "Popular", icon: Flame },
  { id: "settings", label: "Ajustes", icon: Settings },
];

const BottomNav = ({ tab, onChange }: BottomNavProps) => (
  <nav
    className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-card/95 backdrop-blur"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    aria-label="Navegación principal"
  >
    <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
      {items.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        if (id === "browse") {
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={active ? "page" : undefined}
              className="relative flex items-center justify-center"
            >
              <span
                className={`flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full shadow-md ${
                  active ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                }`}
              >
                <Search className="h-6 w-6" />
              </span>
              <span className="sr-only">{label}</span>
            </button>
          );
        }
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className={`h-5 w-5 ${id === "favorites" && active ? "fill-current" : ""}`} />
            {label}
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
