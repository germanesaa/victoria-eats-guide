import { useState, useEffect } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import PromoBanner from "@/components/PromoBanner";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useRestaurantStatus, RestaurantStatus } from "@/hooks/useRestaurantStatus";
import { notificationService } from "@/services/notificationService";
import foodPatternBg from "@/assets/food-pattern-bg.png.asset.json";
import quecomerLogo from "@/assets/quecomer-logo.png";

// Visual meta for category tiles (emoji + soft tile color)
const CATEGORY_META: Record<string, { emoji: string; bg: string }> = {
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
  bebida: { emoji: "🥤", bg: "bg-sky-200/80 dark:bg-sky-900/50" },
  bebidas: { emoji: "🥤", bg: "bg-sky-200/80 dark:bg-sky-900/50" },
  cafe: { emoji: "☕", bg: "bg-amber-100/80 dark:bg-amber-950/50" },
  café: { emoji: "☕", bg: "bg-amber-100/80 dark:bg-amber-950/50" },
  desayuno: { emoji: "🥐", bg: "bg-yellow-200/80 dark:bg-yellow-900/50" },
  desayunos: { emoji: "🥐", bg: "bg-yellow-200/80 dark:bg-yellow-900/50" },
  mariscos: { emoji: "🦐", bg: "bg-cyan-200/80 dark:bg-cyan-900/50" },
  mexicana: { emoji: "🌮", bg: "bg-red-200/80 dark:bg-red-900/50" },
  pollo: { emoji: "🍗", bg: "bg-orange-100/80 dark:bg-orange-950/50" },
  parrilla: { emoji: "🥩", bg: "bg-red-300/70 dark:bg-red-950/50" },
  asiatica: { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50" },
  asiática: { emoji: "🥡", bg: "bg-fuchsia-200/80 dark:bg-fuchsia-900/50" },
  vegana: { emoji: "🥬", bg: "bg-green-200/80 dark:bg-green-900/50" },
  vegetariana: { emoji: "🥦", bg: "bg-green-200/80 dark:bg-green-900/50" },
  helado: { emoji: "🍦", bg: "bg-pink-100/80 dark:bg-pink-950/50" },
  helados: { emoji: "🍦", bg: "bg-pink-100/80 dark:bg-pink-950/50" },
};

const getCategoryMeta = (cat: string) => {
  const key = cat.toLowerCase();
  return CATEGORY_META[key] ?? { emoji: "🍴", bg: "bg-muted/70" };
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<RestaurantStatus | "all">("all");
  const [headerVisible, setHeaderVisible] = useState(true);

  const { restaurants } = useRestaurants();

  // Derive categories from actual restaurant data so nothing is missed
  const dataCategories: string[] = Array.from(
    new Set(restaurants.map((r) => r.category.toLowerCase()))
  ).sort();
  const categories: string[] = ["all", ...dataCategories];

  const restaurantsWithStatus = useRestaurantStatus(restaurants);

  useEffect(() => {
    notificationService.initialize().then((success) => {
      if (success) {
        console.log('Push notifications initialized successfully');
      } else {
        console.log('Push notifications not available or permission denied');
      }
    });
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredRestaurants = restaurantsWithStatus
    .filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || restaurant.category.toLowerCase() === selectedCategory;
      const matchesStatus = selectedStatus === "all" || restaurant.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

  const handleBusinessWhatsApp = () => {
    const message = encodeURIComponent("Hola! Soy una empresa interesada en aparecer en QuéComer");
    const whatsappUrl = `https://wa.me/1234567890?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen relative">
      {/* WhatsApp-style tiled food pattern background */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          backgroundImage: `url(${foodPatternBg.url})`,
          backgroundRepeat: "repeat",
          backgroundSize: "420px auto",
        }}
      />
      {/* Soft green tint overlay for brand cohesion */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-green-100/40 via-emerald-50/30 to-lime-100/30 dark:from-green-950/70 dark:via-emerald-950/60 dark:to-lime-950/70" />
      {/* Ambient blurred blobs for liquid feel */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-300/30 dark:bg-green-700/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-300/25 dark:bg-emerald-700/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-lime-300/20 dark:bg-lime-700/15 rounded-full blur-3xl" />
      </div>

      {/* Status filter chip (top, only when active) */}
      {selectedStatus !== "all" && (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="glass px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filtrando por estado:</span>
            <button
              onClick={() => setSelectedStatus("all")}
              className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground flex items-center gap-1"
            >
              {selectedStatus === "open" ? "Abierto" : selectedStatus === "closed" ? "Cerrado" : "Abre pronto"}
              <span aria-hidden>×</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Promo Banner */}
      <div className="fixed bottom-24 left-4 right-4 z-40">
        <PromoBanner />
      </div>

      {/* Main Content */}
      <main className="pt-14 pb-40">
        <div className="container mx-auto px-4">
          {/* Small floating logo top-left */}
          <div className="fixed top-3 left-4 z-40">
            <img
              src={quecomerLogo}
              alt="QuéComer"
              className="w-6 h-6 object-contain opacity-80"
            />
          </div>

          {/* Categorías como tiles con ícono */}
          <section className="mb-5">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground mb-3 px-1">
              Categorías
            </h2>
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 min-w-max pb-1">
                {categories.map((category) => {
                  const meta = getCategoryMeta(category);
                  const active = selectedCategory === category;
                  const label = category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1);
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="flex flex-col items-center gap-1.5 w-[72px] flex-shrink-0 group"
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all duration-200 ${meta.bg} ${
                          active
                            ? "ring-2 ring-primary scale-105"
                            : "ring-1 ring-white/40 group-hover:scale-105"
                        }`}
                      >
                        <span>{meta.emoji}</span>
                      </div>
                      <span
                        className={`text-[11px] font-semibold text-center leading-tight ${
                          active ? "text-primary" : "text-foreground/80"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sección destacada */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Restaurantes
            </h2>
            <span className="text-xs font-medium text-foreground/70">
              {filteredRestaurants.length} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id}>
                <RestaurantCard
                  restaurant={restaurant}
                  onCategoryClick={(cat) => {
                    setSelectedCategory(cat.toLowerCase());
                  }}
                  onStatusClick={(status) => {
                    setSelectedStatus(status);
                  }}
                />
              </div>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-foreground/70 mb-2">No se encontraron restaurantes</h3>
              <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom: Search bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="glass-strong border-t border-border/40">
          <div className="container mx-auto px-4 py-3">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
