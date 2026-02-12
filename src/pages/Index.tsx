import { useState, useEffect } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import PromoBanner from "@/components/PromoBanner";
import { restaurants } from "@/data/restaurants";
import { useRestaurantStatus } from "@/hooks/useRestaurantStatus";
import { notificationService } from "@/services/notificationService";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [headerVisible, setHeaderVisible] = useState(true);

  const categories = ["all", "comida china", "pizza", "hamburguesas", "parrilla", "sushi", "postres"];

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
    .filter(restaurant => restaurant.id !== 1)
    .filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || restaurant.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const handleBusinessWhatsApp = () => {
    const message = encodeURIComponent("Hola! Soy una empresa interesada en aparecer en Victoria Eats");
    const whatsappUrl = `https://wa.me/1234567890?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100/60 via-sky-50/40 to-violet-100/50 dark:from-emerald-950/60 dark:via-sky-950/40 dark:to-violet-950/50 relative">
      {/* Ambient blurred blobs for liquid feel */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-700/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-sky-300/20 dark:bg-sky-700/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-violet-300/20 dark:bg-violet-700/15 rounded-full blur-3xl" />
      </div>

      {/* Fixed Search Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="glass-strong">
          <div className="container mx-auto px-4 py-3">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>
        
        {/* Horizontal Scrolling Categories */}
        <div className="glass border-t-0" style={{ borderTop: 'none' }}>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 py-3 min-w-max">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    selectedCategory === category 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "glass-card text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Promo Banner fixed below categories */}
        <PromoBanner />
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-muted-foreground text-center">
              {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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

      {/* Footer */}
      <footer className="glass-strong border-t border-border/40">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground mb-1">Victoria Eats</p>
            <p className="text-muted-foreground text-xs">&copy; 2025 Guía Gastronómica La Victoria</p>
            <p className="text-muted-foreground text-xs mt-1">Descubre los mejores sabores de tu ciudad</p>
            
            <div className="mt-4 pt-3 border-t border-border/30">
              <p className="text-muted-foreground text-xs mb-2">¿Eres empresa? Únete a Victoria Eats</p>
              <button
                onClick={handleBusinessWhatsApp}
                className="inline-flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-lg shadow-primary/20"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contáctanos
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
