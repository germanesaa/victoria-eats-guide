
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
    { name: "Pizzas", items: ["Margherita", "Pepperoni", "Hawaiana"], price: "$12 - $20" },
    { name: "Bebidas", items: ["Jugos naturales", "Sodas", "Agua"], price: "$1 - $4" }
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
            <Badge variant="secondary" className="bg-white/90 text-gray-700 mb-2 text-right">
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 font-['Playfair_Display']">Menú</h3>
              <Utensils className="w-6 h-6 text-green-600" />
            </div>
            
            {/* Menu Categories */}
            <div className="space-y-6">
              {menuCategories.map((category, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-800 font-['Playfair_Display']">{category.name}</h4>
                    <div className="text-2xl font-bold text-green-600 font-['Playfair_Display']">
                      {category.price}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                  {index < menuCategories.length - 1 && (
                    <div className="mt-6 border-b border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>

            {/* External Menu Link */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300 mt-6 py-3"
              onClick={() => window.open(restaurant.menuUrl || '#', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="font-medium">Ver menú completo</span>
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
