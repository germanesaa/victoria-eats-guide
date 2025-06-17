
import { useMemo } from 'react';
import { Restaurant, RestaurantHours } from '@/data/restaurants';

export type RestaurantStatus = 'open' | 'closed' | 'opening-soon';

interface RestaurantWithStatus extends Restaurant {
  status: RestaurantStatus;
  opensIn?: string;
}

export const useRestaurantStatus = (restaurants: Restaurant[]): RestaurantWithStatus[] => {
  return useMemo(() => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = daysOfWeek[now.getDay()];

    const getRestaurantStatus = (restaurant: Restaurant): { status: RestaurantStatus; opensIn?: string } => {
      const todayHours = restaurant.detailedHours[today];
      
      if (!todayHours) {
        // Check if opens tomorrow
        const tomorrowIndex = (now.getDay() + 1) % 7;
        const tomorrow = daysOfWeek[tomorrowIndex];
        const tomorrowHours = restaurant.detailedHours[tomorrow];
        
        if (tomorrowHours) {
          return { status: 'closed', opensIn: `Abre mañana a las ${tomorrowHours.open}` };
        }
        return { status: 'closed' };
      }

      const openTime = parseInt(todayHours.open.replace(':', ''));
      const closeTime = parseInt(todayHours.close.replace(':', ''));
      
      // Handle midnight crossover (e.g., 18:00 - 24:00)
      if (closeTime < openTime) {
        if (currentTime >= openTime || currentTime <= closeTime) {
          return { status: 'open' };
        }
      } else {
        if (currentTime >= openTime && currentTime <= closeTime) {
          return { status: 'open' };
        }
      }

      // Check if opening soon (within 2 hours)
      const timeUntilOpen = openTime - currentTime;
      if (timeUntilOpen > 0 && timeUntilOpen <= 200) {
        const hours = Math.floor(timeUntilOpen / 100);
        const minutes = timeUntilOpen % 100;
        const opensIn = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        return { status: 'opening-soon', opensIn };
      }

      return { status: 'closed' };
    };

    const restaurantsWithStatus = restaurants.map(restaurant => {
      const { status, opensIn } = getRestaurantStatus(restaurant);
      return { ...restaurant, status, opensIn };
    });

    // Sort by: Hot restaurants first, then by status (open, opening-soon, closed), then by priority
    return restaurantsWithStatus.sort((a, b) => {
      // Hot restaurants first
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      
      // Then by status priority
      const statusPriority = { open: 0, 'opening-soon': 1, closed: 2 };
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      // Then by priority (if both have priority)
      if (a.priority && b.priority) {
        return a.priority - b.priority;
      }
      
      // If only one has priority, it goes first
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      
      // Finally by name
      return a.name.localeCompare(b.name);
    });
  }, [restaurants]);
};
