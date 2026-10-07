import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

const CURRENT_PLACE = "La Victoria";
const COMING_SOON = ["San Mateo", "El Consejo", "Tejerías", "Turmero", "Cagua"];

const PlacePicker = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative mb-1">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-1.5 rounded-full bg-[#e6d7c8] px-3 py-2 text-xs font-semibold text-[#262826]"
      >
        <MapPin className="h-3.5 w-3.5 text-[#47542f]" />
        {CURRENT_PLACE}
        <ChevronDown className={`h-3.5 w-3.5 text-[#47542f] ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-52 overflow-hidden rounded-2xl bg-[#e6d7c8] py-1 shadow-[0_16px_40px_rgba(38,40,38,0.22)]">
          <ul role="listbox" aria-label="Lugar">
            <li>
              <button
                type="button"
                role="option"
                aria-selected="true"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-[#262826]"
              >
                <MapPin className="h-3.5 w-3.5 text-[#709a2d]" />
                {CURRENT_PLACE}
              </button>
            </li>
          </ul>
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#47542f]">Próximamente</p>
          <ul aria-label="Próximamente">
            {COMING_SOON.map((place) => (
              <li key={place} aria-disabled="true" className="px-3 py-2 text-sm text-[#47542f]">
                {place}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlacePicker;
