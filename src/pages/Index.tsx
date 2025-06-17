import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import { restaurants } from "@/data/restaurants";
import { useRestaurantStatus } from "@/hooks/useRestaurantStatus";
import { notificationService } from "@/services/notificationService";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [headerVisible, setHeaderVisible] = useState(true);

  const categories = ["all", "comida china", "pizza", "hamburguesas", "parrilla", "sushi", "postres"];

  // Get restaurants with status and sorting
  const restaurantsWithStatus = useRestaurantStatus(restaurants);

  // Initialize notifications on component mount
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

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter restaurants (excluding Sabor Victoriano from regular list but keep it for hot section)
  const filteredRestaurants = restaurantsWithStatus
    .filter(restaurant => restaurant.id !== 1) // Remove Sabor Victoriano from regular list
    .filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || restaurant.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Fixed Search Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>
        
        {/* Horizontal Scrolling Categories */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-100">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 py-3 min-w-max">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    selectedCategory === category 
                      ? "bg-green-500 text-white shadow-md" 
                      : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200 hover:border-green-300"
                  }`}
                >
                  {category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with top padding for fixed header */}
      <main className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600 text-center">
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
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron restaurantes</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Victoria Eats</p>
          <p className="text-gray-400">&copy; 2025 Guía Gastronómica La Victoria</p>
          <p className="text-gray-400 text-sm mt-2">Descubre los mejores sabores de tu ciudad</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
