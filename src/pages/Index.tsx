import { useState, useEffect } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchOverlay from "@/components/SearchOverlay";
import { Search, Bell, BellOff, BellRing } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";
import PromoBanner from "@/components/PromoBanner";
import InstallPrompt from "@/components/InstallPrompt";
import NotificationOptIn from "@/components/NotificationOptIn";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useRestaurantStatus, RestaurantStatus } from "@/hooks/useRestaurantStatus";
import { getCategoryMeta, getAllCategories } from "@/lib/categoryMeta";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<RestaurantStatus | "all">("all");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const { restaurants } = useRestaurants();
  const { toast } = useToast();
  const {
    supported: pushSupported,
    subscribed: pushSubscribed,
    loading: pushLoading,
    subscribe: pushSubscribe,
    unsubscribe: pushUnsubscribe,
  } = usePushNotifications();

  const handleToggleNotifications = async () => {
    if (pushSubscribed) {
      await pushUnsubscribe();
      toast({ title: "Notificaciones desactivadas", description: "Ya no recibirás avisos de promociones." });
    } else {
      const ok = await pushSubscribe();
      toast(
        ok
          ? { title: "¡Notificaciones activadas!", description: "Te avisaremos de las promociones." }
          : {
              title: "No se activaron",
              description: "Permite las notificaciones en tu navegador.",
              variant: "destructive" as const,
            }
      );
    }
  };

  // Derive categories from actual restaurant data (primary + extras) so nothing is missed
  const dataCategories: string[] = Array.from(
    new Set(
      restaurants.flatMap((r) => getAllCategories(r.category, r.categories))
    )
  ).sort();
  const categories: string[] = ["all", ...dataCategories];

  const restaurantsWithStatus = useRestaurantStatus(restaurants);


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
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-to-br from-primary/70 to-primary-dark/70 backdrop-blur-xl rounded-b-2xl shadow-sm border-b border-primary-foreground/10">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <img
            src="/brand/logo-original.png"
            alt="QuéComer"
            className="h-9 w-auto"
          />
          {pushSupported && (
            <button
              type="button"
              onClick={handleToggleNotifications}
              disabled={pushLoading}
              aria-label={pushSubscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
              title={pushSubscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
              className="w-9 h-9 rounded-full bg-card/90 flex items-center justify-center shadow-sm text-primary transition active:scale-95 disabled:opacity-60"
            >
              {pushLoading ? (
                <BellRing className="w-4 h-4 animate-pulse" />
              ) : pushSubscribed ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </header>


      {/* Status filter chip (below header, only when active) */}
      {selectedStatus !== "all" && (
        <div className={`fixed top-14 left-0 right-0 z-40 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
      <main className="pt-16 pb-40">
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

          <footer className="mt-10 border-t border-border px-2 py-6 text-center">
            <img
              src="/brand/mark-original.png"
              alt=""
              className="mx-auto mb-3 h-10 w-auto"
            />
            <p className="text-sm font-medium leading-relaxed text-foreground">
              © 2026 quecomerve.com - Operado por German jose esaa alezard.
            </p>
          </footer>
        </div>
      </main>

      {/* Fixed Bottom: Search bar */}
      <div
        className="fixed left-0 right-0 z-50"
        style={{ bottom: "var(--kb-offset, 0px)" }}
      >
        <div className="bg-card border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="container mx-auto px-4 py-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="relative w-full h-11 pl-10 pr-4 rounded-full border border-border/50 bg-background text-left text-sm text-muted-foreground hover:border-primary/50 transition"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              {searchTerm ? (
                <span className="text-foreground truncate block">{searchTerm}</span>
              ) : (
                "Buscar restaurantes, comida, ubicación..."
              )}
            </button>
          </div>
        </div>
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        restaurants={restaurantsWithStatus}
      />

      <InstallPrompt />
      <NotificationOptIn />
    </div>
  );
};

export default Index;
