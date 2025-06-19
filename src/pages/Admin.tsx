import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Save, Upload } from "lucide-react";
import { restaurants, Restaurant } from "@/data/restaurants";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToPublic, validateImageFile } from "@/utils/imageUpload";

const Admin = () => {
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>(restaurants);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const emptyRestaurant: Omit<Restaurant, 'id'> = {
    name: "",
    category: "",
    image: "",
    hours: "",
    detailedHours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    },
    location: "",
    phone: "",
    menuUrl: "",
    description: "",
    isHot: false,
    priority: undefined
  };

  const [newRestaurant, setNewRestaurant] = useState(emptyRestaurant);

  const categories = ["comida china", "pizza", "hamburguesas", "parrilla", "sushi", "postres", "café", "mariscos", "pollos"];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadImageToPublic(file);
      setNewRestaurant({ ...newRestaurant, image: imageUrl });

      toast({
        title: "Imagen cargada",
        description: "La imagen ha sido cargada exitosamente.",
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error al cargar imagen",
        description: "Ocurrió un error al cargar la imagen.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (isAddingNew) {
      const newId = Math.max(...restaurantList.map(r => r.id)) + 1;
      const restaurantToAdd = { ...newRestaurant, id: newId };
      setRestaurantList([...restaurantList, restaurantToAdd]);
      setNewRestaurant(emptyRestaurant);
      setIsAddingNew(false);
      toast({
        title: "Restaurante agregado",
        description: "El restaurante ha sido agregado exitosamente.",
      });
    }
  };

  const handleDelete = (id: number) => {
    setRestaurantList(restaurantList.filter(r => r.id !== id));
    toast({
      title: "Restaurante eliminado",
      description: "El restaurante ha sido eliminado exitosamente.",
    });
  };

  const generateDataFile = () => {
    const dataContent = `export interface RestaurantHours {
  [key: string]: { open: string; close: string } | null;
}

export interface Restaurant {
  id: number;
  name: string;
  category: string;
  image: string;
  hours: string;
  detailedHours: RestaurantHours;
  location: string;
  phone: string;
  menuUrl?: string;
  description?: string;
  isHot?: boolean;
  priority?: number;
}

export const restaurants: Restaurant[] = ${JSON.stringify(restaurantList, null, 2)};`;

    const blob = new Blob([dataContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'restaurants.ts';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Archivo generado",
      description: "El archivo restaurants.ts ha sido descargado. Reemplaza el archivo en src/data/restaurants.ts",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Administrador de Restaurantes</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddingNew(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Restaurante
            </Button>
            <Button onClick={generateDataFile} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Descargar Datos
            </Button>
          </div>
        </div>

        {/* Add New Restaurant Form */}
        {isAddingNew && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agregar Nuevo Restaurante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                    placeholder="Nombre del restaurante"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={newRestaurant.category} onValueChange={(value) => setNewRestaurant({...newRestaurant, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Imagen del Restaurante</Label>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      className="flex items-center gap-2"
                      onClick={() => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        fileInput?.click();
                      }}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Subir Imagen
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {newRestaurant.image && (
                    <div className="flex items-center space-x-4">
                      <img 
                        src={newRestaurant.image} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Imagen cargada exitosamente</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
                    placeholder="584126000000"
                  />
                </div>
                <div>
                  <Label htmlFor="hours">Horarios</Label>
                  <Input
                    id="hours"
                    value={newRestaurant.hours}
                    onChange={(e) => setNewRestaurant({...newRestaurant, hours: e.target.value})}
                    placeholder="Lun-Dom 12:00pm - 10:00pm"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={newRestaurant.location}
                    onChange={(e) => setNewRestaurant({...newRestaurant, location: e.target.value})}
                    placeholder="Dirección del restaurante"
                  />
                </div>
                <div>
                  <Label htmlFor="menuUrl">URL del Menú (opcional)</Label>
                  <Input
                    id="menuUrl"
                    value={newRestaurant.menuUrl}
                    onChange={(e) => setNewRestaurant({...newRestaurant, menuUrl: e.target.value})}
                    placeholder="https://ejemplo.com/menu"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isHot"
                    checked={newRestaurant.isHot}
                    onCheckedChange={(checked) => setNewRestaurant({...newRestaurant, isHot: checked})}
                  />
                  <Label htmlFor="isHot">Restaurante HOT</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newRestaurant.description}
                  onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})}
                  placeholder="Descripción del restaurante"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsAddingNew(false);
                  setNewRestaurant(emptyRestaurant);
                }}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restaurants List */}
        <div className="grid gap-4">
          {restaurantList.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <p className="text-gray-600">{restaurant.category}</p>
                      <p className="text-sm text-gray-500">{restaurant.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(restaurant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
