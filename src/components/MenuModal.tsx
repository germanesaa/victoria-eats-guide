
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Clock, MapPin, Phone, Utensils, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface MenuModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

const MenuModal = ({ restaurant, isOpen, onClose }: MenuModalProps) => {
  if (!restaurant) return null;

  const menuCategories = [
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border/40 bg-background/80 backdrop-blur-2xl [&>button]:hidden">
        {/* Restaurant Image Header */}
        <div className="relative h-48 w-full">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-10 w-10 glass rounded-full text-white hover:bg-white/30"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="glass text-foreground mb-2">
              {restaurant.category}
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-1">{restaurant.name}</h2>
            {restaurant.description && (
              <p className="text-white/90 text-sm">{restaurant.description}</p>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Restaurant Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">{restaurant.hours}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">{restaurant.location}</span>
            </div>
          </div>

          {/* Menu Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground font-playfair">Menú</h3>
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            
            <div className="space-y-4">
              {menuCategories.map((category, index) => (
                <div key={index} className="glass-card rounded-xl p-4 flex items-center justify-between bg-muted/40">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground font-playfair mb-1">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.items.join(', ')}</p>
                  </div>
                  <div className="text-lg font-bold text-primary font-playfair">
                    {category.price}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-200 mt-6"
              onClick={() => window.open(restaurant.menuUrl || '#', '_blank')}
            >
              <ExternalLink className="w-5 h-5" />
              <span>Ver menú completo</span>
            </button>
          </div>

          {/* Contact Actions */}
          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="flex justify-center gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>
              <button
                onClick={() => window.open(`tel:${restaurant.phone}`, '_self')}
                className="w-16 h-16 glass hover:bg-white/60 text-primary rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Phone className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;
