import { useState, useEffect, useRef } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import PromoBanner from "@/components/PromoBanner";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useRestaurantStatus, RestaurantStatus } from "@/hooks/useRestaurantStatus";
import { notificationService } from "@/services/notificationService";
import foodPatternBg from "@/assets/food-pattern-bg.png.asset.json";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<RestaurantStatus | "all">("all");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const { restaurants } = useRestaurants();

  // Derive categories from actual restaurant data so nothing is missed
  const dataCategories: string[] = Array.from(
    new Set(restaurants.map((r) => r.category.toLowerCase()))
  ).sort();
  const categories: string[] = ["all", ...dataCategories];
  const VISIBLE_COUNT = 6;
  const visibleCategories = categories.slice(0, VISIBLE_COUNT);
  const hiddenCategories = categories.slice(VISIBLE_COUNT);
  const hasMoreCategories = hiddenCategories.length > 0;

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

  // Close "ver más" dropdown when clicking outside
  useEffect(() => {
    if (!showAllCategories) return;
    const handleClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowAllCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAllCategories]);

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

      {/* Fixed Categories Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Horizontal Scrolling Categories */}
        <div className="glass border-t-0" style={{ borderTop: 'none' }}>
          <div className="overflow-x-auto scrollbar-hide relative">
            <div className="flex gap-2 px-4 py-3 min-w-max items-center">
              {visibleCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    selectedCategory === category 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "glass-card text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
              {hasMoreCategories && (
                <div className="relative flex-shrink-0" ref={moreMenuRef}>
                  <button
                    onClick={() => setShowAllCategories(v => !v)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      hiddenCategories.includes(selectedCategory)
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "glass-card text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {showAllCategories ? "Cerrar" : "Ver más"}
                  </button>
                  {showAllCategories && (
                    <div className="absolute right-0 bottom-full mb-2 z-50 min-w-[180px] max-h-[60vh] overflow-y-auto glass-strong rounded-2xl border border-border/40 shadow-xl p-2 flex flex-col gap-1">
                      {hiddenCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowAllCategories(false);
                          }}
                          className={`px-3 py-2 rounded-xl text-sm font-medium text-left transition-all ${
                            selectedCategory === category
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/80 hover:bg-primary/10"
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status filter chips */}
        {selectedStatus !== "all" && (
          <div className="glass border-t-0 px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filtrando por estado:</span>
            <button
              onClick={() => setSelectedStatus("all")}
              className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground flex items-center gap-1"
            >
              {selectedStatus === "open" ? "Abierto" : selectedStatus === "closed" ? "Cerrado" : "Abre pronto"}
              <span aria-hidden>×</span>
            </button>
          </div>
        )}
      </header>

      {/* Floating Promo Banner */}
      <div className="fixed bottom-24 left-4 right-4 z-40">
        <PromoBanner />
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-muted-foreground text-center">
              {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onCategoryClick={(cat) => {
                  setSelectedCategory(cat.toLowerCase());
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onStatusClick={(status) => {
                  setSelectedStatus(status);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
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

      {/* Fixed Bottom Search Bar */}
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
