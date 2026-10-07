import { useEffect, useMemo, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import RestaurantPage from "@/components/RestaurantPage";
import SearchBar from "@/components/SearchBar";
import PlacePicker from "@/components/PlacePicker";
import BottomNav, { AppTab } from "@/components/BottomNav";
import { Bell, BellOff, Moon, Sun } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";
import PromoBanner from "@/components/PromoBanner";
import InstallPrompt from "@/components/InstallPrompt";
import NotificationOptIn from "@/components/NotificationOptIn";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useRestaurantStatus, RestaurantStatus } from "@/hooks/useRestaurantStatus";
import { getAllCategories } from "@/lib/categoryMeta";
import {
  applyTheme,
  loadFavorites,
  loadReviews,
  loadTheme,
  saveFavorites,
  saveReviews,
  StoredReview,
  ThemeMode,
} from "@/lib/localStore";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RestaurantStatus | "all">("all");
  const [tab, setTab] = useState<AppTab>("browse");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [openId, setOpenId] = useState<string | null>(null);

  const { restaurants } = useRestaurants();
  const { toast } = useToast();
  const {
    supported: pushSupported,
    subscribed: pushSubscribed,
    loading: pushLoading,
    subscribe: pushSubscribe,
    unsubscribe: pushUnsubscribe,
  } = usePushNotifications();

  useEffect(() => {
    setFavorites(loadFavorites());
    setReviews(loadReviews());
    const stored = loadTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

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

  const dataCategories = useMemo(
    () =>
      Array.from(new Set(restaurants.flatMap((restaurant) => getAllCategories(restaurant.category, restaurant.categories)))).sort(),
    [restaurants]
  );
  const categories = ["all", ...dataCategories];
  const restaurantsWithStatus = useRestaurantStatus(restaurants);

  const filteredRestaurants = restaurantsWithStatus.filter((restaurant) => {
    if (tab === "favorites" && !favorites.includes(restaurant.id)) return false;
    if (tab === "trending" && !restaurant.isHot) return false;
    const allCats = getAllCategories(restaurant.category, restaurant.categories);
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      restaurant.name.toLowerCase().includes(term) ||
      allCats.some((category) => category.includes(term)) ||
      restaurant.location.toLowerCase().includes(term);
    const matchesCategory = selectedCategory === "all" || allCats.includes(selectedCategory);
    const matchesStatus = selectedStatus === "all" || restaurant.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const directoryGroups = useMemo(() => {
    const groups = new Map<string, typeof filteredRestaurants>();
    [...filteredRestaurants]
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .forEach((restaurant) => {
        const letter = restaurant.name.trim().charAt(0).toUpperCase() || "#";
        const key = /[A-ZÁÉÍÓÚÑ]/i.test(letter) ? letter : "#";
        groups.set(key, [...(groups.get(key) || []), restaurant]);
      });
    return Array.from(groups.entries());
  }, [filteredRestaurants]);

  const openRestaurant = restaurantsWithStatus.find((restaurant) => restaurant.id === openId) || null;

  const ratingByRestaurant = useMemo(() => {
    const grouped = new Map<string, number[]>();
    reviews.forEach((review) => {
      grouped.set(review.restaurantId, [...(grouped.get(review.restaurantId) || []), review.stars]);
    });
    return grouped;
  }, [reviews]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      saveFavorites(next);
      return next;
    });
  };

  const saveReview = (input: { name: string; comment: string; stars: number }) => {
    if (!openRestaurant) return;
    setReviews((current) => {
      const existing = current.find((review) => review.restaurantId === openRestaurant.id);
      const next = existing
        ? current.map((review) =>
            review.restaurantId === openRestaurant.id ? { ...review, ...input, updatedAt: Date.now() } : review
          )
        : [
            ...current,
            {
              id: crypto.randomUUID(),
              restaurantId: openRestaurant.id,
              ...input,
              updatedAt: Date.now(),
            },
          ];
      saveReviews(next);
      return next;
    });
  };

  const handleToggleNotifications = async () => {
    if (pushSubscribed) {
      await pushUnsubscribe();
      toast({ title: "Notificaciones desactivadas", description: "Ya no recibirás avisos de promociones." });
    } else {
      const ok = await pushSubscribe();
      toast(
        ok
          ? { title: "Notificaciones activadas", description: "Te avisaremos de las promociones." }
          : {
              title: "No se activaron",
              description: "Permite las notificaciones en tu navegador.",
              variant: "destructive" as const,
            }
      );
    }
  };

  const changeTab = (next: AppTab) => {
    setTab(next);
    setCategoryOpen(false);
    if (next === "browse") {
      window.scrollTo({ top: 0 });
      document.getElementById("quecomer-search")?.focus();
    }
  };

  const setMode = (mode: ThemeMode) => {
    setTheme(mode);
    applyTheme(mode);
  };

  const titles: Record<AppTab, string> = {
    browse: "Restaurantes",
    favorites: "Favoritos",
    directory: "Directorio",
    trending: "Populares",
    settings: "Ajustes",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-[70] bg-[#47542f] dark:bg-[#262826]">
        <div className="mx-auto max-w-lg px-4 pb-4 pt-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <img src="/brand/logo-blanco.png" alt="QuéComer" className="h-14 w-auto" />
            <PlacePicker />
          </div>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoryOpen={categoryOpen}
            onCategoryOpenChange={setCategoryOpen}
          />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-28 pt-4">
        {selectedStatus !== "all" && tab !== "settings" && (
          <button
            type="button"
            onClick={() => setSelectedStatus("all")}
            className="mb-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
          >
            {selectedStatus === "open" ? "Abierto" : selectedStatus === "closed" ? "Cerrado" : "Abre pronto"} ×
          </button>
        )}

        {tab !== "settings" && (
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">{titles[tab]}</h2>
            <span className="text-xs text-muted-foreground">
              {filteredRestaurants.length} encontrado{filteredRestaurants.length === 1 ? "" : "s"}
            </span>
          </div>
        )}

        {tab === "settings" && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Ajustes</h2>
            <div className="rounded-2xl bg-card p-4 shadow-[0_10px_28px_rgba(38,40,38,0.12)]">
              <p className="text-sm font-medium text-foreground">Apariencia</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode("light")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium ${
                    theme === "light" ? "bg-[#709a2d] text-[#262826]" : "text-[#262826] ring-1 ring-[#47542f] dark:text-[#e6d7c8] dark:ring-[#e6d7c8]"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => setMode("dark")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium ${
                    theme === "dark" ? "bg-[#709a2d] text-[#262826]" : "text-[#262826] ring-1 ring-[#47542f] dark:text-[#e6d7c8] dark:ring-[#e6d7c8]"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Oscuro
                </button>
              </div>
            </div>
            {pushSupported && (
              <div className="rounded-2xl bg-card p-4 shadow-[0_10px_28px_rgba(38,40,38,0.12)]">
                <p className="text-sm font-medium text-foreground">Notificaciones</p>
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  disabled={pushLoading}
                  className="mt-3 flex h-11 items-center gap-2 rounded-xl bg-[#47542f] px-3 text-sm font-medium text-[#e6d7c8]"
                >
                  {pushSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  {pushSubscribed ? "Desactivar promociones" : "Activar promociones"}
                </button>
              </div>
            )}
          </section>
        )}

        {tab === "directory" && (
          <div className="space-y-4">
            {directoryGroups.map(([letter, group]) => (
              <section key={letter}>
                <h3 className="sticky top-36 z-10 bg-[#e6d7c8] py-1 text-xs font-semibold text-[#47542f] dark:bg-[#47542f] dark:text-[#e6d7c8]">{letter}</h3>
                <ul className="overflow-hidden rounded-2xl bg-card shadow-[0_10px_28px_rgba(38,40,38,0.12)]">
                  {group.map((restaurant) => (
                    <li key={restaurant.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(restaurant.id)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                      >
                        <span className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                          {restaurant.image ? (
                            <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <img src="/brand/mark-original.png" alt="" className="h-full w-full object-contain p-1.5" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{restaurant.name}</span>
                          {restaurant.location && (
                            <span className="block truncate text-xs text-muted-foreground">{restaurant.location}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {(tab === "browse" || tab === "favorites" || tab === "trending") && (
          <div className="grid grid-cols-2 gap-3">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                favorite={favorites.includes(restaurant.id)}
                rating={(() => {
                  const scores = ratingByRestaurant.get(restaurant.id) || [];
                  if (!scores.length) return 0;
                  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
                })()}
                reviewCount={(ratingByRestaurant.get(restaurant.id) || []).length}
                onOpen={() => setOpenId(restaurant.id)}
                onToggleFavorite={() => toggleFavorite(restaurant.id)}
                onCategoryClick={(category) => setSelectedCategory(category.toLowerCase())}
                onStatusClick={(status) => setSelectedStatus(status)}
              />
            ))}
          </div>
        )}

        {tab !== "settings" && filteredRestaurants.length === 0 && (
          <div className="py-16 text-center">
            <h3 className="text-base font-semibold text-foreground/80">
              {tab === "favorites" ? "Todavía no tienes favoritos" : "No se encontraron restaurantes"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "favorites" ? "Toca la estrella en un restaurante para guardarlo aquí." : "Prueba con otra búsqueda o categoría."}
            </p>
          </div>
        )}

        <footer className="mt-10 border-t border-border px-2 py-6 text-center">
          <img src="/brand/mark-original.png" alt="" className="mx-auto mb-3 h-10 w-auto" />
          <p className="text-sm font-medium leading-relaxed text-foreground">
            © 2026 quecomerve.com - Operado por German jose esaa alezard.
          </p>
        </footer>
      </main>

      <BottomNav tab={tab} onChange={changeTab} />
      <PromoBanner />

      {openRestaurant && (
        <RestaurantPage
          restaurant={openRestaurant}
          favorite={favorites.includes(openRestaurant.id)}
          reviews={reviews.filter((review) => review.restaurantId === openRestaurant.id)}
          onClose={() => setOpenId(null)}
          onToggleFavorite={() => toggleFavorite(openRestaurant.id)}
          onSaveReview={saveReview}
        />
      )}

      <InstallPrompt />
      <NotificationOptIn />
    </div>
  );
};

export default Index;
