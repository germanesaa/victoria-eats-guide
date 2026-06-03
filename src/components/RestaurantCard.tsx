
import { Clock, MapPin, Star, Flame, Menu as MenuIcon } from "lucide-react";
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
      return 'bg-emerald-500/90 text-white';
    case 'opening-soon':
      return 'bg-amber-400/90 text-white';
    case 'closed':
      return 'bg-red-500/80 text-white';
    default:
      return 'bg-gray-500/80 text-white';
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
      <div className="group flex flex-col gap-3">
        {/* Image — separated, fully rounded card */}
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {restaurant.isHot && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500/90 text-white flex items-center gap-1 border border-white/30 rounded-full px-2.5 py-1 shadow-lg">
                <Flame className="w-3 h-3" />
                HOT
              </Badge>
            </div>
          )}
        </div>

        {/* Info block — below the image, modern typography */}
        <div className="px-1 flex flex-col gap-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg md:text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            {restaurant.isHot && (
              <Star className="w-4 h-4 text-amber-400 fill-current" />
            )}
          </div>

          {/* Category + status pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick?.(restaurant.category);
              }}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-medium capitalize hover:bg-primary/20 transition"
              aria-label={`Filtrar por ${restaurant.category}`}
            >
              {restaurant.category}
            </button>
            {restaurant.status && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (restaurant.status) onStatusClick?.(restaurant.status);
                }}
                className={`${getStatusColor(restaurant.status)} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm hover:brightness-110 transition`}
                aria-label={`Filtrar por estado ${restaurant.status}`}
              >
                {getStatusText(restaurant.status, restaurant.opensIn)}
              </button>
            )}
          </div>

          {/* Description */}
          {restaurant.description && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {restaurant.description}
            </p>
          )}

          {/* Meta */}
          <div className="space-y-1.5">
            <div className="flex items-center text-muted-foreground text-xs md:text-sm">
              <Clock className="w-3.5 h-3.5 mr-2 text-primary" />
              <span>{restaurant.hours}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-xs md:text-sm">
              <MapPin className="w-3.5 h-3.5 mr-2 text-primary" />
              <span className="truncate">{restaurant.location}</span>
            </div>
          </div>

          {/* Actions — modern pill buttons */}
          <div className="flex gap-2 pt-1">
            <WhatsAppButton phone={restaurant.phone} restaurantName={restaurant.name} />
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 bg-foreground/5 hover:bg-foreground/10 border border-border/60 text-foreground font-medium py-2.5 px-4 rounded-full transition-all duration-200 text-sm"
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon className="w-4 h-4" />
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
