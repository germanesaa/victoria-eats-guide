import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload, X, Megaphone, Clock, Maximize2, LogOut } from "lucide-react";
import { Restaurant, MenuCategory } from "@/data/restaurants";
import { useRestaurants } from "@/hooks/useRestaurants";
import { getBannerConfig, saveBannerConfig, BannerConfig, BannerSize } from "@/data/bannerConfig";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToPublic, validateImageFile } from "@/utils/imageUpload";
import { isValidBannerUrl } from "@/utils/urlValidation";
import { PREDEFINED_CATEGORIES, getCategoryMeta } from "@/lib/categoryMeta";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import type { Session } from "@supabase/supabase-js";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Credenciales inválidas");
      setLoading(false);
      return;
    }
    onLogin();
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      setError("Error al iniciar sesión con Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Acceso Administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "Conectando..." : "Iniciar sesión con Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">o</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { restaurants: restaurantList, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurants();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>({
    enabled: false, text: "", image: "", linkUrl: "", linkText: "", scheduleStart: null, scheduleEnd: null, size: "medium",
  });
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const { toast } = useToast();

  const emptyRestaurant: Omit<Restaurant, 'id'> = {
    name: "",
    category: "",
    categories: [],
    image: "",
    hours: "",
    detailedHours: {
      monday: { open: "09:00", close: "20:00" },
      tuesday: { open: "09:00", close: "20:00" },
      wednesday: { open: "09:00", close: "20:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "09:00", close: "20:00" },
      sunday: { open: "09:00", close: "20:00" }
    },
    location: "",
    phone: "",
    menuUrl: "",
    description: "",
    isHot: false,
    priority: undefined,
    menuCategories: []
  };

  const [newRestaurant, setNewRestaurant] = useState(emptyRestaurant);
  const [editingRestaurant, setEditingRestaurant] = useState(emptyRestaurant);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const categories = PREDEFINED_CATEGORIES;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from("user_roles" as any)
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .then(({ data }) => {
            setIsAdmin(Array.isArray(data) && data.length > 0);
            setAuthLoading(false);
          });
      } else {
        setIsAdmin(false);
        setAuthLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from("user_roles" as any)
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .then(({ data }) => {
            setIsAdmin(Array.isArray(data) && data.length > 0);
            setAuthLoading(false);
          });
      } else {
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load banner config from database
  useEffect(() => {
    getBannerConfig().then(setBannerConfig);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  const updateBanner = async (updated: BannerConfig) => {
    if (updated.linkUrl) {
      const validation = isValidBannerUrl(updated.linkUrl);
      if (!validation.valid) {
        toast({ title: "URL inválida", description: validation.error, variant: "destructive" });
        return;
      }
    }
    setBannerConfig(updated);
    await saveBannerConfig(updated);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
  }

  if (!session) {
    return <AdminLogin onLogin={() => {}} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-lg font-medium">No tienes permisos de administrador</p>
            <p className="text-sm text-muted-foreground">Contacta al administrador para obtener acceso.</p>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({ title: "Error", description: validation.error, variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImageToPublic(file);
      if (isEditing) {
        setEditingRestaurant({ ...editingRestaurant, image: imageUrl });
      } else {
        setNewRestaurant({ ...newRestaurant, image: imageUrl });
      }
      toast({ title: "Imagen cargada", description: "La imagen ha sido cargada exitosamente." });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({ title: "Error al cargar imagen", description: "Ocurrió un error al cargar la imagen.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!isAddingNew) return;
    if (!newRestaurant.name || !newRestaurant.category) {
      toast({ title: "Campos requeridos", description: "Nombre y categoría son obligatorios.", variant: "destructive" });
      return;
    }
    try {
      await createRestaurant(newRestaurant);
      setNewRestaurant(emptyRestaurant);
      setIsAddingNew(false);
      toast({ title: "Restaurante agregado", description: "El restaurante ha sido guardado en la base de datos." });
    } catch (e: any) {
      toast({ title: "Error al guardar", description: e?.message || "No se pudo guardar el restaurante.", variant: "destructive" });
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditingRestaurant({
      name: restaurant.name, category: restaurant.category,
      categories: restaurant.categories || [],
      image: restaurant.image,
      hours: restaurant.hours, detailedHours: restaurant.detailedHours, location: restaurant.location,
      phone: restaurant.phone, menuUrl: restaurant.menuUrl || "", description: restaurant.description || "",
      isHot: restaurant.isHot || false, priority: restaurant.priority,
      menuCategories: restaurant.menuCategories || []
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await updateRestaurant(editingId, editingRestaurant);
      setEditingId(null);
      setEditingRestaurant(emptyRestaurant);
      toast({ title: "Restaurante actualizado", description: "Cambios guardados en la base de datos." });
    } catch (e: any) {
      toast({ title: "Error al actualizar", description: e?.message || "No se pudo actualizar.", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => { setEditingId(null); setEditingRestaurant(emptyRestaurant); };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este restaurante?")) return;
    try {
      await deleteRestaurant(id);
      toast({ title: "Restaurante eliminado" });
    } catch (e: any) {
      toast({ title: "Error al eliminar", description: e?.message || "No se pudo eliminar.", variant: "destructive" });
    }
  };

  const renderRestaurantForm = (restaurant: any, setRestaurant: any, isEditing = false) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={restaurant.name}
            onChange={(e) => setRestaurant({...restaurant, name: e.target.value})}
            placeholder="Nombre del restaurante"
          />
        </div>
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={restaurant.category} onValueChange={(value) => setRestaurant({...restaurant, category: value})}>
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

      {/* Multi-category selector — extra categories the restaurant also offers */}
      <div className="space-y-2">
        <Label>Categorías adicionales</Label>
        <p className="text-xs text-muted-foreground">
          Marca todas las categorías que este restaurante ofrece (además de la principal). Ej: una pastelería que también vende pizzas y café.
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const selected = (restaurant.categories || []).includes(cat);
            const isPrimary = restaurant.category === cat;
            const meta = getCategoryMeta(cat);
            return (
              <button
                key={cat}
                type="button"
                disabled={isPrimary}
                onClick={() => {
                  const current: string[] = restaurant.categories || [];
                  const next = selected
                    ? current.filter((c) => c !== cat)
                    : [...current, cat];
                  setRestaurant({ ...restaurant, categories: next });
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                  isPrimary
                    ? "border-primary/40 bg-primary/10 text-primary opacity-60 cursor-not-allowed"
                    : selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : `border-gray-300 ${meta.bg} text-foreground hover:brightness-95`
                }`}
                title={isPrimary ? "Esta es la categoría principal" : ""}
              >
                <span>{meta.emoji}</span>
                <span>{cat}</span>
                {isPrimary && <span className="ml-1 text-[10px]">(principal)</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Imagen del Restaurante</Label>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              ref={isEditing ? editFileInputRef : newFileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, isEditing)}
              disabled={isUploading}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              className="flex items-center gap-2"
              onClick={() => {
                const ref = isEditing ? editFileInputRef : newFileInputRef;
                ref.current?.click();
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
          
          {restaurant.image && (
            <div className="flex items-center space-x-4">
              <img 
                src={restaurant.image} 
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
            value={restaurant.phone}
            onChange={(e) => setRestaurant({...restaurant, phone: e.target.value})}
            placeholder="584126000000"
          />
        </div>
        <div>
          <Label htmlFor="hours">Horarios</Label>
          <Input
            id="hours"
            value={restaurant.hours}
            onChange={(e) => setRestaurant({...restaurant, hours: e.target.value})}
            placeholder="Lun-Dom 09:00am - 08:00pm"
          />
        </div>
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={restaurant.location}
            onChange={(e) => setRestaurant({...restaurant, location: e.target.value})}
            placeholder="Dirección del restaurante"
          />
        </div>
        <div>
          <Label htmlFor="menuUrl">URL del Menú (opcional)</Label>
          <Input
            id="menuUrl"
            value={restaurant.menuUrl}
            onChange={(e) => setRestaurant({...restaurant, menuUrl: e.target.value})}
            placeholder="https://ejemplo.com/menu"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isHot"
            checked={restaurant.isHot}
            onCheckedChange={(checked) => setRestaurant({...restaurant, isHot: checked})}
          />
          <Label htmlFor="isHot">Restaurante HOT</Label>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={restaurant.description}
          onChange={(e) => setRestaurant({...restaurant, description: e.target.value})}
          placeholder="Descripción del restaurante"
        />
      </div>

      {/* Menu Categories Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Categorías del Menú</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const cats = [...(restaurant.menuCategories || []), { name: "", items: [""], price: "" }];
              setRestaurant({ ...restaurant, menuCategories: cats });
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Agregar categoría
          </Button>
        </div>
        {(restaurant.menuCategories || []).map((cat: MenuCategory, catIdx: number) => (
          <div key={catIdx} className="border rounded-lg p-4 space-y-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Categoría {catIdx + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const cats = (restaurant.menuCategories || []).filter((_: MenuCategory, i: number) => i !== catIdx);
                  setRestaurant({ ...restaurant, menuCategories: cats });
                }}
                className="text-red-600 hover:text-red-700 h-7"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Nombre</Label>
                <Input
                  value={cat.name}
                  onChange={(e) => {
                    const cats = [...(restaurant.menuCategories || [])];
                    cats[catIdx] = { ...cats[catIdx], name: e.target.value };
                    setRestaurant({ ...restaurant, menuCategories: cats });
                  }}
                  placeholder="Ej: Hamburguesas"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Precio</Label>
                <Input
                  value={cat.price}
                  onChange={(e) => {
                    const cats = [...(restaurant.menuCategories || [])];
                    cats[catIdx] = { ...cats[catIdx], price: e.target.value };
                    setRestaurant({ ...restaurant, menuCategories: cats });
                  }}
                  placeholder="Ej: $8 - $15"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Items (separados por coma)</Label>
              <Input
                value={cat.items.join(", ")}
                onChange={(e) => {
                  const cats = [...(restaurant.menuCategories || [])];
                  cats[catIdx] = { ...cats[catIdx], items: e.target.value.split(",").map((s: string) => s.trim()) };
                  setRestaurant({ ...restaurant, menuCategories: cats });
                }}
                placeholder="Ej: Clásica, Especial, Doble Carne"
                className="h-8 text-sm"
              />
            </div>
          </div>
        ))}
        {(!restaurant.menuCategories || restaurant.menuCategories.length === 0) && (
          <p className="text-xs text-muted-foreground">Sin categorías de menú. Se mostrarán valores por defecto.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Administrador de Restaurantes</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddingNew(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Restaurante
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>

        {/* Banner Management */}
        <Card className="mb-6 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Banner Promocional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="bannerEnabled"
                checked={bannerConfig.enabled}
                onCheckedChange={(checked) => {
                  const updated = { ...bannerConfig, enabled: checked };
                  updateBanner(updated);
                  toast({ title: checked ? "Banner activado" : "Banner desactivado" });
                }}
              />
              <Label htmlFor="bannerEnabled" className="font-medium">
                {bannerConfig.enabled ? "Banner activo" : "Banner desactivado"}
              </Label>
            </div>

            {/* Schedule */}
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Programar horario (opcional)</Label>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Si configuras un horario, el banner solo se mostrará durante esas horas. Déjalo vacío para mostrarlo todo el día.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Hora inicio</Label>
                  <Input
                    type="time"
                    value={bannerConfig.scheduleStart || ""}
                    onChange={(e) => updateBanner({ ...bannerConfig, scheduleStart: e.target.value || null })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Hora fin</Label>
                  <Input
                    type="time"
                    value={bannerConfig.scheduleEnd || ""}
                    onChange={(e) => updateBanner({ ...bannerConfig, scheduleEnd: e.target.value || null })}
                    className="mt-1"
                  />
                </div>
              </div>
              {bannerConfig.scheduleStart && bannerConfig.scheduleEnd && (
                <p className="text-xs text-primary mt-2">
                  ⏰ El banner se mostrará de {bannerConfig.scheduleStart} a {bannerConfig.scheduleEnd}
                </p>
              )}
            </div>

            {/* Size */}
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Tamaño del banner</Label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "small" as BannerSize, label: "Pequeño (fijo)", desc: "Se mantiene visible al hacer scroll" },
                  { value: "medium" as BannerSize, label: "Mediano", desc: "Tamaño estándar" },
                  { value: "large" as BannerSize, label: "Grande", desc: "Máxima visibilidad" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateBanner({ ...bannerConfig, size: opt.value })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      bannerConfig.size === opt.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Imagen del banner</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={isBannerUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const validation = validateImageFile(file);
                    if (!validation.valid) {
                      toast({ title: "Error", description: validation.error, variant: "destructive" });
                      return;
                    }
                    setIsBannerUploading(true);
                    try {
                      const imageUrl = await uploadImageToPublic(file);
                      await updateBanner({ ...bannerConfig, image: imageUrl });
                      toast({ title: "Imagen del banner cargada" });
                    } catch {
                      toast({ title: "Error al cargar imagen", variant: "destructive" });
                    } finally {
                      setIsBannerUploading(false);
                    }
                  }}
                />
              </div>
              {bannerConfig.image && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={bannerConfig.image} alt="Banner preview" className="h-20 rounded-lg border object-cover" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateBanner({ ...bannerConfig, image: "" })}
                  >
                    <X className="w-4 h-4" /> Quitar
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label>Texto del banner</Label>
              <Textarea
                value={bannerConfig.text}
                onChange={(e) => updateBanner({ ...bannerConfig, text: e.target.value })}
                placeholder="Ej: 🔥 ¡Promoción especial! 2x1 en pizzas este fin de semana"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>URL del enlace (opcional)</Label>
                <Input
                  value={bannerConfig.linkUrl}
                  onChange={(e) => updateBanner({ ...bannerConfig, linkUrl: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Texto del botón (opcional)</Label>
                <Input
                  value={bannerConfig.linkText}
                  onChange={(e) => updateBanner({ ...bannerConfig, linkText: e.target.value })}
                  placeholder="Ver más"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Restaurant Form */}
        {isAddingNew && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agregar Nuevo Restaurante</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRestaurantForm(newRestaurant, setNewRestaurant)}
              <div className="flex gap-2 mt-4">
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
                {editingId === restaurant.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Editando: {restaurant.name}</h3>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {renderRestaurantForm(editingRestaurant, setEditingRestaurant, true)}
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(restaurant)}
                      >
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
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
