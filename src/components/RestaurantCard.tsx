
import { Clock, MapPin, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "./WhatsAppButton";
import MenuModal from "./MenuModal";
import { useState } from "react";
import { RestaurantStatus } from "@/hooks/useRestaurantStatus";

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
  isHot?: boolean;
  priority?: number;
  status?: RestaurantStatus;
  opensIn?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const getStatusColor = (status: RestaurantStatus) => {
  switch (status) {
    case 'open':
      return 'bg-green-500 text-white';
    case 'opening-soon':
      return 'bg-yellow-500 text-white';
    case 'closed':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusText = (status: RestaurantStatus, opensIn?: string) => {
  switch (status) {
    case 'open':
      return 'Abierto';
    case 'opening-soon':
      return opensIn ? `Abre en ${opensIn}` : 'Abre pronto';
    case 'closed':
      return opensIn || 'Cerrado';
    default:
      return 'Cerrado';
  }
};

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
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 min-w-[80px] flex justify-center">
              <span className="text-white text-xs font-medium text-center">
                {restaurant.category}
              </span>
            </div>
            {restaurant.status && (
              <div className={`${getStatusColor(restaurant.status)} backdrop-blur-sm rounded-full px-3 py-1 min-w-[80px] flex justify-center`}>
                <span className="text-xs font-medium text-center">
                  {getStatusText(restaurant.status, restaurant.opensIn)}
                </span>
              </div>
            )}
          </div>
          {restaurant.isHot && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white flex items-center gap-1">
                <Flame className="w-3 h-3" />
                HOT
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
              {restaurant.name}
            </h3>
            {restaurant.isHot && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </div>
          
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
