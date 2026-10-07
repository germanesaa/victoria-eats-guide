import { useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { getCategoryMeta } from "@/lib/categoryMeta";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryOpen: boolean;
  onCategoryOpenChange: (open: boolean) => void;
  inputId?: string;
}

const labelFor = (category: string) =>
  category === "all" ? "Todo" : category.charAt(0).toUpperCase() + category.slice(1);

const SearchBar = ({
  value,
  onChange,
  categories,
  selectedCategory,
  onCategoryChange,
  categoryOpen,
  onCategoryOpenChange,
  inputId = "quecomer-search",
}: SearchBarProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoryOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onCategoryOpenChange(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCategoryOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [categoryOpen, onCategoryOpenChange]);

  return (
    <div ref={rootRef} className="relative">
      <div className="flex h-12 items-center rounded-full bg-[#e6d7c8]">
        <Search className="ml-3.5 h-4 w-4 shrink-0 text-[#47542f]" />
        <input
          id={inputId}
          type="search"
          enterKeyHint="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar restaurantes..."
          className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-[#262826] outline-none placeholder:text-[#47542f]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="mr-1 flex h-7 w-7 items-center justify-center rounded-full text-[#47542f]"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          aria-expanded={categoryOpen}
          aria-haspopup="listbox"
          onClick={() => onCategoryOpenChange(!categoryOpen)}
          className="mr-1.5 flex h-8 max-w-[42%] items-center gap-1 rounded-full bg-[#709a2d] px-3 text-xs font-semibold text-[#262826]"
        >
          <span className="truncate">{labelFor(selectedCategory)}</span>
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-[#262826] ${categoryOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {categoryOpen && (
        <ul
          role="listbox"
          aria-label="Categorías"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[min(18rem,50vh)] overflow-y-auto rounded-2xl bg-[#e6d7c8] py-1 shadow-lg"
        >
          {categories.map((category) => {
            const active = category === selectedCategory;
            const meta = getCategoryMeta(category);
            return (
              <li key={category}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onCategoryChange(category);
                    onCategoryOpenChange(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm ${
                    active ? "bg-[#709a2d] font-medium text-[#262826]" : "text-[#262826] hover:bg-[#47542f] hover:text-[#e6d7c8]"
                  }`}
                >
                  <span className="w-6 text-center text-base leading-none">{meta.emoji}</span>
                  <span className="truncate">{labelFor(category)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
