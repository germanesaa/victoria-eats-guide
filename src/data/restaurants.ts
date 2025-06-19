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
    "id": 2,
    "name": "Pizza Express Victoria",
    "category": "pizza",
    "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "hours": "Mar-Dom 5:00pm - 11:00pm",
    "detailedHours": {
      "monday": null,
      "tuesday": {
        "open": "17:00",
        "close": "23:00"
      },
      "wednesday": {
        "open": "17:00",
        "close": "23:00"
      },
      "thursday": {
        "open": "17:00",
        "close": "23:00"
      },
      "friday": {
        "open": "17:00",
        "close": "23:00"
      },
      "saturday": {
        "open": "17:00",
        "close": "23:00"
      },
      "sunday": {
        "open": "17:00",
        "close": "23:00"
      }
    },
    "location": "Centro Comercial Victoria Plaza",
    "phone": "584125555555",
    "menuUrl": "https://ejemplo.com/pizza-menu",
    "description": "Pizzas artesanales con ingredientes frescos y masa casera."
  },
  {
    "id": 3,
    "name": "Burger Palace",
    "category": "hamburguesas",
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "hours": "Lun-Jue 11:00am - 10:00pm, Vie-Dom 11:00am - 11:00pm",
    "detailedHours": {
      "monday": {
        "open": "11:00",
        "close": "22:00"
      },
      "tuesday": {
        "open": "11:00",
        "close": "22:00"
      },
      "wednesday": {
        "open": "11:00",
        "close": "22:00"
      },
      "thursday": {
        "open": "11:00",
        "close": "22:00"
      },
      "friday": {
        "open": "11:00",
        "close": "23:00"
      },
      "saturday": {
        "open": "11:00",
        "close": "23:00"
      },
      "sunday": {
        "open": "11:00",
        "close": "23:00"
      }
    },
    "location": "Av. Bolívar, La Victoria",
    "phone": "584127777777",
    "description": "Las mejores hamburguesas gourmet de la ciudad con papas crujientes."
  },
  {
    "id": 4,
    "name": "Parrilla Don José",
    "category": "parrilla",
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "hours": "Mie-Dom 6:00pm - 12:00am",
    "detailedHours": {
      "monday": null,
      "tuesday": null,
      "wednesday": {
        "open": "18:00",
        "close": "24:00"
      },
      "thursday": {
        "open": "18:00",
        "close": "24:00"
      },
      "friday": {
        "open": "18:00",
        "close": "24:00"
      },
      "saturday": {
        "open": "18:00",
        "close": "24:00"
      },
      "sunday": {
        "open": "18:00",
        "close": "24:00"
      }
    },
    "location": "Calle Principal, La Victoria",
    "phone": "584123333333",
    "menuUrl": "https://ejemplo.com/parrilla-menu",
    "description": "Carnes a la parrilla de primera calidad en ambiente familiar."
  },
  {
    "id": 5,
    "name": "Sushi Bar Tokio",
    "category": "sushi",
    "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "hours": "Lun-Sab 1:00pm - 10:00pm",
    "detailedHours": {
      "monday": {
        "open": "13:00",
        "close": "22:00"
      },
      "tuesday": {
        "open": "13:00",
        "close": "22:00"
      },
      "wednesday": {
        "open": "13:00",
        "close": "22:00"
      },
      "thursday": {
        "open": "13:00",
        "close": "22:00"
      },
      "friday": {
        "open": "13:00",
        "close": "22:00"
      },
      "saturday": {
        "open": "13:00",
        "close": "22:00"
      },
      "sunday": null
    },
    "location": "Centro de La Victoria",
    "phone": "584129999999",
    "menuUrl": "https://ejemplo.com/sushi-menu",
    "description": "Sushi auténtico y rolls creativos preparados por sushiman japonés."
  },
  {
    "id": 6,
    "name": "Dulcería Victoria",
    "category": "postres",
    "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "hours": "Lun-Dom 10:00am - 9:00pm",
    "detailedHours": {
      "monday": {
        "open": "10:00",
        "close": "21:00"
      },
      "tuesday": {
        "open": "10:00",
        "close": "21:00"
      },
      "wednesday": {
        "open": "10:00",
        "close": "21:00"
      },
      "thursday": {
        "open": "10:00",
        "close": "21:00"
      },
      "friday": {
        "open": "10:00",
        "close": "21:00"
      },
      "saturday": {
        "open": "10:00",
        "close": "21:00"
      },
      "sunday": {
        "open": "10:00",
        "close": "21:00"
      }
    },
    "location": "Plaza Miranda, La Victoria",
    "phone": "584124444444",
    "description": "Postres artesanales, tortas personalizadas y dulces tradicionales.",
    "isHot": true,
    "priority": 2
  },
  {
    "id": 7,
    "name": "Cacao Café",
    "category": "café",
    "image": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "hours": "Lun-Vie 6:00am - 8:00pm, Sab-Dom 7:00am - 7:00pm",
    "detailedHours": {
      "monday": {
        "open": "06:00",
        "close": "20:00"
      },
      "tuesday": {
        "open": "06:00",
        "close": "20:00"
      },
      "wednesday": {
        "open": "06:00",
        "close": "20:00"
      },
      "thursday": {
        "open": "06:00",
        "close": "20:00"
      },
      "friday": {
        "open": "06:00",
        "close": "20:00"
      },
      "saturday": {
        "open": "07:00",
        "close": "19:00"
      },
      "sunday": {
        "open": "07:00",
        "close": "19:00"
      }
    },
    "location": "Av. Miranda, La Victoria",
    "phone": "584128888888",
    "menuUrl": "https://ejemplo.com/cafe-menu",
    "description": "Café de especialidad, desayunos y meriendas en ambiente acogedor."
  },
  {
    "id": 9,
    "name": "Arturos",
    "category": "pollos",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35fc2fea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "hours": "Lun-Dom 12:00pm - 9:00pm",
    "detailedHours": {
      "monday": {
        "open": "12:00",
        "close": "21:00"
      },
      "tuesday": {
        "open": "12:00",
        "close": "21:00"
      },
      "wednesday": {
        "open": "12:00",
        "close": "21:00"
      },
      "thursday": {
        "open": "12:00",
        "close": "21:00"
      },
      "friday": {
        "open": "12:00",
        "close": "21:00"
      },
      "saturday": {
        "open": "12:00",
        "close": "21:00"
      },
      "sunday": {
        "open": "12:00",
        "close": "21:00"
      }
    },
    "location": "C.C Palma Center, La Victoria",
    "phone": "584126666666",
    "description": "Pollo de verdad."
  },
  {
    "name": "Cacao Café",
    "category": "café",
    "image": "data:image/png;base64,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",
    "hours": "Lun-Dom 09:00am - 08:00pm",
    "detailedHours": {
      "monday": null,
      "tuesday": null,
      "wednesday": null,
      "thursday": null,
      "friday": null,
      "saturday": null,
      "sunday": null
    },
    "location": "Av Victoria",
    "phone": "584120000000",
    "menuUrl": "https://ejemplo.com",
    "description": "El mejor café de la Victoria, a los mejores pecios",
    "isHot": true,
    "id": 10
  }
];