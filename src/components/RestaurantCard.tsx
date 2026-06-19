
import { Clock, MapPin, Star, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el click vino de un botón interactivo (categoría, estado, WhatsApp), no abrir menú
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('[data-no-menu]');
    if (isInteractive) return;
    setIsMenuOpen(true);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hola! Me interesa información sobre ${restaurant.name}`);
    const whatsappUrl = `https://wa.me/${restaurant.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div
        className="group flex flex-col cursor-pointer rounded-3xl glass-card p-2 shadow-sm hover:shadow-md transition-all duration-300"
        onClick={handleCardClick}
      >
        {/* Image — separated, fully rounded card */}
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {restaurant.isHot && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-500/90 text-white flex items-center gap-1 border border-white/30 rounded-full px-2 py-0.5 text-[10px] shadow-lg">
                <Flame className="w-2.5 h-2.5" />
                HOT
              </Badge>
            </div>
          )}
          {/* Encapsulated WhatsApp button — floating icon inside the image */}
          <button
            type="button"
            data-no-menu
            onClick={handleWhatsAppClick}
            className="absolute bottom-2 right-2 w-8 h-8 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 transition-all duration-200"
            aria-label="WhatsApp"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </button>
        </div>

        {/* Info block — compact */}
        <div className="px-1.5 pt-2 pb-1 flex flex-col gap-1.5">
          {/* Title */}
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-sm md:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            {restaurant.isHot && (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current flex-shrink-0" />
            )}
          </div>

          {/* Category + status pills */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              data-no-menu
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick?.(restaurant.category);
              }}
              className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-medium capitalize hover:bg-primary/20 transition"
              aria-label={`Filtrar por ${restaurant.category}`}
            >
              {restaurant.category}
            </button>
            {restaurant.status && (
              <button
                type="button"
                data-no-menu
                onClick={(e) => {
                  e.stopPropagation();
                  if (restaurant.status) onStatusClick?.(restaurant.status);
                }}
                className={`${getStatusColor(restaurant.status)} inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm hover:brightness-110 transition`}
                aria-label={`Filtrar por estado ${restaurant.status}`}
              >
                {getStatusText(restaurant.status, restaurant.opensIn)}
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-foreground/75 text-[10px] font-medium">
            <div className="flex items-center gap-1 min-w-0">
              <Clock className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="truncate">{restaurant.hours}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-foreground/75 text-[10px] font-medium">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="truncate">{restaurant.location}</span>
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
