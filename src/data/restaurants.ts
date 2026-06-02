export interface RestaurantHours {
  [key: string]: { open: string; close: string } | null;
}

export interface MenuCategory {
  name: string;
  items: string[];
  price: string;
}

export interface Restaurant {
  id: string;
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
  menuCategories?: MenuCategory[];
}