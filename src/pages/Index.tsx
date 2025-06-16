import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import { restaurants } from "@/data/restaurants";
const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [headerVisible, setHeaderVisible] = useState(true);
  const categories = ["all", "comida china", "pizza", "hamburguesas", "parrilla", "sushi", "postres"];
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setHeaderVisible(false);
      } else {
        // Scrolling up
        setHeaderVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()) || restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || restaurant.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <header className={`bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-4">
          {/* Logo and Search Bar Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0">
              <img src="/lovable-uploads/97e26ff5-dfa8-4f41-ace9-908caced1a64.png" alt="Victoria Eats" className="h-12 w-auto object-cover" />
            </div>
            <div className="flex-1">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg" : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200 hover:border-green-300"}`}>
                {category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map(restaurant => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
        </div>

        {filteredRestaurants.length === 0 && <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron restaurantes</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
          </div>}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Victoria Eats</p>
          <p className="text-gray-400">&copy; 2025 Guía Gastronómica La Victoria</p>
          <p className="text-gray-400 text-sm mt-2">Descubre los mejores sabores de tu ciudad</p>
        </div>
      </footer>
    </div>;
};
export default Index;