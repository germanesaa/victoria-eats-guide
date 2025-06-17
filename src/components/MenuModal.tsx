
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, MapPin, Phone, Utensils, DollarSign, ExternalLink } from "lucide-react";
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
            
            {/* Menu Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Utensils className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">Menú del día</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Consultar precios</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Utensils className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">Especialidades</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Ver precios</span>
                </div>
              </div>

              {/* External Menu Link */}
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300"
                onClick={() => window.open(restaurant.menuUrl || '#', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver menú completo</span>
              </Button>
            </div>
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
