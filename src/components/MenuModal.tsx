
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Clock, MapPin, Phone, Utensils, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MenuCategory {
  name: string;
  items: string[];
  price: string;
}

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
  menuCategories?: MenuCategory[];
}

interface MenuModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

const MenuModal = ({ restaurant, isOpen, onClose }: MenuModalProps) => {
  if (!restaurant) return null;

  const menuCategories = restaurant.menuCategories && restaurant.menuCategories.length > 0
    ? restaurant.menuCategories
    : [
        { name: "Hamburguesas", items: ["Clásica", "Especial", "Doble Carne"], price: "$8 - $15" },
        { name: "Pizzas", items: ["Margherita", "Pepperoni", "Hawaiana"], price: "$12 - $20" },
        { name: "Bebidas", items: ["Jugos naturales", "Sodas", "Agua"], price: "$1 - $4" }
      ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hola! Me interesa información sobre ${restaurant.name}`);
    const whatsappUrl = `https://wa.me/${restaurant.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/30 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border/40 bg-background/80 backdrop-blur-2xl shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        {/* Restaurant Image Header */}
        <div className="relative h-28 w-full">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 glass rounded-full text-white hover:bg-white/30"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-2 left-3 right-3">
            <Badge variant="secondary" className="glass text-foreground mb-1 text-[10px] px-2 py-0">
              {restaurant.category}
            </Badge>
            <h2 className="text-lg font-bold text-white leading-tight">{restaurant.name}</h2>
          </div>
        </div>

        <div className="p-4 max-h-[calc(70vh-7rem)] overflow-y-auto">
          {/* Restaurant Info */}
          <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-primary" />
              <span>{restaurant.hours}</span>
            </div>
            <div className="flex items-center truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
              <span className="truncate">{restaurant.location}</span>
            </div>
          </div>

          {/* Menu Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground font-display">Menú</h3>
              <Utensils className="w-4 h-4 text-primary" />
            </div>
            
            <div className="space-y-2">
              {menuCategories.map((category, index) => (
                <div key={index} className="glass-card rounded-xl px-3 py-2 flex items-center justify-between bg-muted/40">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground font-display leading-tight">{category.name}</h4>
                    <p className="text-[11px] text-muted-foreground truncate">{category.items.join(', ')}</p>
                  </div>
                  <div className=

            <button 
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-primary/25 text-sm transition-all"
              onClick={() => window.open(restaurant.menuUrl || '#', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver menú completo</span>
            </button>
          </div>

          {/* Contact Actions */}
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex justify-center gap-3">
              <button
                onClick={handleWhatsAppClick}
                className="w-11 h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transition-all shadow-lg shadow-primary/25"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>
              <button
                onClick={() => window.open(`tel:${restaurant.phone}`, '_self')}
                className="w-11 h-11 glass hover:bg-white/60 text-primary rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default MenuModal;
