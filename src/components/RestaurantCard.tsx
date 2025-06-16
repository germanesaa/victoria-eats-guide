
import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "./WhatsAppButton";
import MenuModal from "./MenuModal";
import { useState } from "react";

interface Restaurant {
  id: number;
  name: string;
  category: string;
  image: string;
  hours: string;
  location: string;
  phone: string;
  menuUrl?: string;
  description?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {restaurant.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
            {restaurant.name}
          </h3>
          
          {restaurant.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {restaurant.description}
            </p>
          )}
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              <span>{restaurant.hours}</span>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              <span className="truncate">{restaurant.location}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <WhatsAppButton phone={restaurant.phone} restaurantName={restaurant.name} />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-700" 
              onClick={() => setIsMenuOpen(true)}
            >
              Ver Menú
            </Button>
          </div>
        </div>
      </div>

      <MenuModal 
        restaurant={restaurant}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default RestaurantCard;
