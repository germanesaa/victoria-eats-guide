import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, X, MapPin } from "lucide-react";
import MenuModal from "./MenuModal";
import { getAllCategories, getCategoryMeta } from "@/lib/categoryMeta";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  restaurants: any[];
}

const SearchOverlay = ({ open, onClose, searchTerm, onSearchChange, restaurants }: SearchOverlayProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (open) {
      // Focus on next tick so keyboard opens
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const term = searchTerm.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return [];
    return restaurants.filter((r) => {
      const cats = getAllCategories(r.category, r.categories);
      return (
        r.name.toLowerCase().includes(term) ||
        cats.some((c: string) => c.includes(term)) ||
        (r.location || "").toLowerCase().includes(term)
      );
    });
  }, [term, restaurants]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-150">
      {/* Header con input */}
      <div className="flex-shrink-0 bg-card border-b border-border/50 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/80 hover:bg-muted transition"
            aria-label="Cerrar búsqueda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              placeholder="Buscar restaurantes, comida, ubicación..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") inputRef.current?.blur();
                if (e.key === "Escape") onClose();
              }}
              className="w-full h-10 pl-9 pr-9 rounded-full bg-muted/60 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  inputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-border/40"
                aria-label="Limpiar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ paddingBottom: "calc(var(--kb-offset, 0px) + 16px)" }}
      >
        {!term && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            Escribe para buscar restaurantes, categorías o ubicaciones.
          </div>
        )}

        {term && results.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="text-sm text-foreground/70 font-medium">Sin resultados para "{searchTerm}"</p>
            <p className="text-xs text-muted-foreground mt-1">Prueba con otro término</p>
          </div>
        )}

        {term && results.length > 0 && (
          <ul className="divide-y divide-border/50">
            {results.map((r) => {
              const cats = getAllCategories(r.category, r.categories);
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 active:bg-muted transition"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                      {r.image && (
                        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-semibold text-sm text-foreground truncate">
                          {r.name}
                        </h4>
                        <span className="text-sm leading-none">
                          {cats.slice(0, 3).map((c) => getCategoryMeta(c).emoji).join(" ")}
                        </span>
                      </div>
                      {r.location && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{r.location}</span>
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selected && (
        <MenuModal
          restaurant={selected}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default SearchOverlay;