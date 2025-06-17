
export interface RestaurantHours {
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

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Sabor Victoriano",
    category: "comida china",
    image: "https://images.unsplash.com/photo-1563379091339-03246970927f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Lun-Dom 12:00pm - 10:00pm",
    detailedHours: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "22:00" },
      saturday: { open: "12:00", close: "22:00" },
      sunday: { open: "12:00", close: "22:00" }
    },
    location: "Av. Victoria, La Victoria",
    phone: "584126000000",
    menuUrl: "https://ejemplo.com/menu",
    description: "Deliciosa comida china y sushi fresco preparado por chefs expertos.",
    isHot: true,
    priority: 1
  },
  {
    id: 2,
    name: "Pizza Express Victoria",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Mar-Dom 5:00pm - 11:00pm",
    detailedHours: {
      monday: null,
      tuesday: { open: "17:00", close: "23:00" },
      wednesday: { open: "17:00", close: "23:00" },
      thursday: { open: "17:00", close: "23:00" },
      friday: { open: "17:00", close: "23:00" },
      saturday: { open: "17:00", close: "23:00" },
      sunday: { open: "17:00", close: "23:00" }
    },
    location: "Centro Comercial Victoria Plaza",
    phone: "584125555555",
    menuUrl: "https://ejemplo.com/pizza-menu",
    description: "Pizzas artesanales con ingredientes frescos y masa casera."
  },
  {
    id: 3,
    name: "Burger Palace",
    category: "hamburguesas",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Lun-Jue 11:00am - 10:00pm, Vie-Dom 11:00am - 11:00pm",
    detailedHours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "11:00", close: "23:00" }
    },
    location: "Av. Bolívar, La Victoria",
    phone: "584127777777",
    description: "Las mejores hamburguesas gourmet de la ciudad con papas crujientes."
  },
  {
    id: 4,
    name: "Parrilla Don José",
    category: "parrilla",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Mie-Dom 6:00pm - 12:00am",
    detailedHours: {
      monday: null,
      tuesday: null,
      wednesday: { open: "18:00", close: "24:00" },
      thursday: { open: "18:00", close: "24:00" },
      friday: { open: "18:00", close: "24:00" },
      saturday: { open: "18:00", close: "24:00" },
      sunday: { open: "18:00", close: "24:00" }
    },
    location: "Calle Principal, La Victoria",
    phone: "584123333333",
    menuUrl: "https://ejemplo.com/parrilla-menu",
    description: "Carnes a la parrilla de primera calidad en ambiente familiar."
  },
  {
    id: 5,
    name: "Sushi Bar Tokio",
    category: "sushi",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Lun-Sab 1:00pm - 10:00pm",
    detailedHours: {
      monday: { open: "13:00", close: "22:00" },
      tuesday: { open: "13:00", close: "22:00" },
      wednesday: { open: "13:00", close: "22:00" },
      thursday: { open: "13:00", close: "22:00" },
      friday: { open: "13:00", close: "22:00" },
      saturday: { open: "13:00", close: "22:00" },
      sunday: null
    },
    location: "Centro de La Victoria",
    phone: "584129999999",
    menuUrl: "https://ejemplo.com/sushi-menu",
    description: "Sushi auténtico y rolls creativos preparados por sushiman japonés."
  },
  {
    id: 6,
    name: "Dulcería Victoria",
    category: "postres",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Lun-Dom 10:00am - 9:00pm",
    detailedHours: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "21:00" },
      saturday: { open: "10:00", close: "21:00" },
      sunday: { open: "10:00", close: "21:00" }
    },
    location: "Plaza Miranda, La Victoria",
    phone: "584124444444",
    description: "Postres artesanales, tortas personalizadas y dulces tradicionales.",
    isHot: true,
    priority: 2
  },
  {
    id: 7,
    name: "Cacao Café",
    category: "café",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Lun-Vie 6:00am - 8:00pm, Sab-Dom 7:00am - 7:00pm",
    detailedHours: {
      monday: { open: "06:00", close: "20:00" },
      tuesday: { open: "06:00", close: "20:00" },
      wednesday: { open: "06:00", close: "20:00" },
      thursday: { open: "06:00", close: "20:00" },
      friday: { open: "06:00", close: "20:00" },
      saturday: { open: "07:00", close: "19:00" },
      sunday: { open: "07:00", close: "19:00" }
    },
    location: "Av. Miranda, La Victoria",
    phone: "584128888888",
    menuUrl: "https://ejemplo.com/cafe-menu",
    description: "Café de especialidad, desayunos y meriendas en ambiente acogedor."
  },
  {
    id: 8,
    name: "Mariscos El Puerto",
    category: "mariscos",
    image: "https://images.unsplash.com/photo-1559737558-2f5a35fc2fea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hours: "Mie-Dom 12:00pm - 9:00pm",
    detailedHours: {
      monday: null,
      tuesday: null,
      wednesday: { open: "12:00", close: "21:00" },
      thursday: { open: "12:00", close: "21:00" },
      friday: { open: "12:00", close: "21:00" },
      saturday: { open: "12:00", close: "21:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    location: "Sector Los Samanes, La Victoria",
    phone: "584126666666",
    description: "Mariscos frescos del día preparados con recetas tradicionales."
  }
];
