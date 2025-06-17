
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, MapPin, Phone, Utensils, DollarSign, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "./WhatsAppButton";

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
    { name: "Cafés", items: ["Americano", "Cappuccino", "Latte"], price: "$2 - $5" },
    { name: "Pizzas", items: ["Margherita", "Pepperoni", "Hawaiana"], price: "$12 - $20" },
    { name: "Postres", items: ["Tiramisu", "Cheesecake", "Brownie"], price: "$4 - $8" },
    { name: "Bebidas", items: ["Jugos naturales", "Sodas", "Agua"], price: "$1 - $4" },
    { name: "Platos principales", items: ["Pollo asado", "Pescado", "Pasta"], price: "$10 - $25" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-white">
        {/* Restaurant Image Header */}
        <div className="relative h-48 w-full">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-700 mb-2">
              {restaurant.category}
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-1">{restaurant.name}</h2>
            {restaurant.description && (
              <p className="text-white/90 text-sm">{restaurant.description}</p>
            )}
          </div>
        </div>

        <div className="p-6 bg-white">
          {/* Restaurant Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm">{restaurant.hours}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm">{restaurant.location}</span>
            </div>
          </div>

          {/* Menu Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Menú</h3>
              <Utensils className="w-5 h-5 text-green-600" />
            </div>
            
            {/* Menu Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuCategories.map((category, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{category.name}</h4>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-3 h-3" />
                      <span className="text-xs font-medium">{category.price}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <p key={itemIndex} className="text-xs text-gray-600">• {item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* External Menu Link */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300 mt-4"
              onClick={() => window.open(restaurant.menuUrl || '#', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver menú completo</span>
            </Button>
          </div>

          {/* Contact Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <WhatsAppButton 
                phone={restaurant.phone} 
                restaurantName={restaurant.name}
                className="flex-1"
              />
              <a 
                href={`tel:${restaurant.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Llamar</span>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;
