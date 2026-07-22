import { useState, useEffect } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import PromoBanner from "@/components/PromoBanner";
import InstallPrompt from "@/components/InstallPrompt";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useRestaurantStatus, RestaurantStatus } from "@/hooks/useRestaurantStatus";
import { notificationService } from "@/services/notificationService";
import quecomerLogo from "@/assets/quecomer-logo-green.png.asset.json";
import { getCategoryMeta, getAllCategories } from "@/lib/categoryMeta";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<RestaurantStatus | "all">("all");
  const [headerVisible, setHeaderVisible] = useState(true);

  const { restaurants } = useRestaurants();

  // Derive categories from actual restaurant data (primary + extras) so nothing is missed
  const dataCategories: string[] = Array.from(
    new Set(
      restaurants.flatMap((r) => getAllCategories(r.category, r.categories))
    )
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

  // Keep fixed bottom bars glued above the on-screen keyboard on mobile.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;
    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--kb-offset", `${offset}px`);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      root.style.setProperty("--kb-offset", "0px");
    };
  }, []);

  const filteredRestaurants = restaurantsWithStatus
    .filter(restaurant => {
      const allCats = getAllCategories(restaurant.category, restaurant.categories);
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        restaurant.name.toLowerCase().includes(term) ||
        allCats.some((c) => c.includes(term)) ||
        restaurant.location.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === "all" || allCats.includes(selectedCategory);
      const matchesStatus = selectedStatus === "all" || restaurant.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

  const handleBusinessWhatsApp = () => {
    const message = encodeURIComponent("Hola! Soy una empresa interesada en aparecer en QuéComer");
    const whatsappUrl = `https://wa.me/1234567890?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-card relative">
      {/* Colored brand header — top half of the two-tone layout */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-b-3xl shadow-md">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-card rounded-full p-1.5 flex items-center justify-center shadow-sm">
              <img
                src={quecomerLogo.url}
                alt="QuéComer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-primary-foreground tracking-tight">
                Qué Comer
              </span>
              <span className="text-[10px] text-primary-foreground/80 font-medium">
                Descubre restaurantes
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Status filter chip (below header, only when active) */}
      {selectedStatus !== "all" && (
        <div className={`fixed top-20 left-0 right-0 z-40 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="bg-card/90 backdrop-blur border-b border-border/40 px-4 py-2 flex items-center gap-2">
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

      {/* Main Content — white bottom area */}
      <main className="pt-24 pb-40">
        <div className="container mx-auto px-4">
          {/* Categorías como tiles con ícono */}
          <section className="mb-5 mt-2">
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground mb-2 px-1">
              Categorías
            </h2>
            <div className="overflow-x-auto scrollbar-hide py-1">
              <div className="flex gap-2 min-w-max px-1 py-2">
                {categories.map((category) => {
                  const meta = getCategoryMeta(category);
                  const active = selectedCategory === category;
                  const label = category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1);
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="flex flex-col items-center gap-1 w-[56px] flex-shrink-0 group"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-200 ${meta.bg} ${
                          active
                            ? "ring-2 ring-primary scale-105"
                            : "ring-1 ring-border/50 group-hover:scale-105"
                        }`}
                      >
                        <span className={`cat-icon cat-anim-${meta.anim}`}>{meta.emoji}</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold text-center leading-tight ${
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
      <div
        className="fixed left-0 right-0 z-50"
        style={{ bottom: "var(--kb-offset, 0px)" }}
      >
        <div className="bg-card border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="container mx-auto px-4 py-3">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>
      </div>

      <InstallPrompt />
    </div>
  );
};

export default Index;
