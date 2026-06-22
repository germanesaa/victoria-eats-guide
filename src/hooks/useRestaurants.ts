import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Restaurant, RestaurantHours, MenuCategory } from "@/data/restaurants";

type Row = {
  id: string;
  name: string;
  category: string;
  categories: string[] | null;
  image: string;
  hours: string;
  detailed_hours: any;
  location: string;
  phone: string;
  menu_url: string | null;
  description: string | null;
  is_hot: boolean;
  priority: number | null;
  menu_categories: any;
};

const rowToRestaurant = (r: Row): Restaurant => ({
  id: r.id,
  name: r.name,
  category: r.category,
  categories: (r.categories || []) as string[],
  image: r.image || "",
  hours: r.hours || "",
  detailedHours: (r.detailed_hours || {}) as RestaurantHours,
  location: r.location || "",
  phone: r.phone || "",
  menuUrl: r.menu_url || "",
  description: r.description || "",
  isHot: !!r.is_hot,
  priority: r.priority ?? undefined,
  menuCategories: (r.menu_categories || []) as MenuCategory[],
});

const restaurantToRow = (r: Omit<Restaurant, "id"> & { id?: string }) => ({
  name: r.name,
  category: r.category,
  categories: r.categories || [],
  image: r.image || "",
  hours: r.hours || "",
  detailed_hours: r.detailedHours || {},
  location: r.location || "",
  phone: r.phone || "",
  menu_url: r.menuUrl || "",
  description: r.description || "",
  is_hot: !!r.isHot,
  priority: r.priority ?? null,
  menu_categories: r.menuCategories || [],
});

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .order("name", { ascending: true });
    if (!error && data) setRestaurants((data as Row[]).map(rowToRestaurant));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("restaurants-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "restaurants" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const createRestaurant = async (data: Omit<Restaurant, "id">) => {
    const { error } = await supabase
      .from("restaurants")
      .insert(restaurantToRow(data) as any);
    if (error) throw error;
    await load();
  };

  const updateRestaurant = async (id: string, data: Omit<Restaurant, "id">) => {
    const { error } = await supabase
      .from("restaurants")
      .update(restaurantToRow(data) as any)
      .eq("id", id);
    if (error) throw error;
    await load();
  };

  const deleteRestaurant = async (id: string) => {
    const { error } = await supabase.from("restaurants").delete().eq("id", id);
    if (error) throw error;
    await load();
  };

  return { restaurants, loading, createRestaurant, updateRestaurant, deleteRestaurant, refresh: load };
};