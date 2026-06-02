
import { Clock, MapPin, Star, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "./WhatsAppButton";
import MenuModal from "./MenuModal";
import { useState } from "react";
import { RestaurantStatus } from "@/hooks/useRestaurantStatus";

interface Restaurant {
  id: string;
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
  onCategoryClick?: (category: string) => void;
  onStatusClick?: (status: RestaurantStatus) => void;
}

const getStatusColor = (status: RestaurantStatus) => {
  switch (status) {
    case 'open':
      return 'bg-emerald-500/80 text-white backdrop-blur-sm';
    case 'opening-soon':
      return 'bg-amber-400/80 text-white backdrop-blur-sm';
    case 'closed':
      return 'bg-red-500/70 text-white backdrop-blur-sm';
    default:
      return 'bg-gray-500/70 text-white backdrop-blur-sm';
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

const RestaurantCard = ({ restaurant, onCategoryClick, onStatusClick }: RestaurantCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden group">
        <div className="relative overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick?.(restaurant.category);
              }}
              className="bg-foreground/50 backdrop-blur-md rounded-full px-3 py-1 min-w-[80px] flex justify-center border border-white/20 hover:bg-primary/80 transition-colors cursor-pointer"
              aria-label={`Filtrar por ${restaurant.category}`}
            >
              <span className="text-white text-xs font-medium text-center capitalize">
                {restaurant.category}
              </span>
            </button>
            {restaurant.status && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (restaurant.status) onStatusClick?.(restaurant.status);
                }}
                className={`${getStatusColor(restaurant.status)} rounded-full px-3 py-1 min-w-[80px] flex justify-center border border-white/20 hover:brightness-110 transition cursor-pointer`}
                aria-label={`Filtrar por estado ${restaurant.status}`}
              >
                <span className="text-xs font-medium text-center">
                  {getStatusText(restaurant.status, restaurant.opensIn)}
                </span>
              </button>
            )}
          </div>
          {restaurant.isHot && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500/80 backdrop-blur-sm text-white flex items-center gap-1 border border-white/20">
                <Flame className="w-3 h-3" />
                HOT
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            {restaurant.isHot && (
              <Star className="w-5 h-5 text-amber-400 fill-current" />
            )}
          </div>
          
          {restaurant.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {restaurant.description}
            </p>
          )}
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>{restaurant.hours}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span className="truncate">{restaurant.location}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <WhatsAppButton phone={restaurant.phone} restaurantName={restaurant.name} />
            
            <button 
              className="flex-1 glass font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm text-foreground/80 hover:text-primary hover:border-primary/30"
              onClick={() => setIsMenuOpen(true)}
            >
              Ver Menú
            </button>
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
