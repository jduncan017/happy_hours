import type { Restaurant } from "@/lib/types";

interface RestaurantInfoContentProps {
  restaurant: Restaurant;
  imageUrl?: string;
}

export function generateRestaurantInfoContent({
  restaurant,
  imageUrl = "/photo-missing.webp",
}: RestaurantInfoContentProps): string {
  return `
    <div style="width: 240px; height: fit-content; padding: 0 0 0 4px; font-family: Montserrat, sans-serif;">
      <div style="width: 100%; height: 160px; background: #AFAFAF; border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
        <img 
          src="${imageUrl}" 
          alt="${restaurant.name}"
          style="width: 100%; height: 100%; object-fit: cover;"
          onerror="this.src='/photo-missing.webp'"
        />
      </div>
      
      <!-- Content -->
      <div style="padding: 0 0 12px;">
        <!-- Restaurant name -->
        <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: bold; color: #111827; line-height: 1.2;">${restaurant.name}</h3>
       
        <!-- Cuisine Type -->
        <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 500; color: #9ca3af;">${restaurant.cuisineType}</p>
        
        <!-- Buttons -->
        <div style="display: flex; gap: 8px;">
          ${
            restaurant.website
              ? `
            <a 
              href="${restaurant.website}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                flex: 1; 
                background: #ff8f28; 
                color: white; 
                padding: 8px 12px; 
                border-radius: 6px; 
                text-decoration: none; 
                font-size: 14px; 
                font-weight: 500;
                text-align: center;
                display: block;
              "
            >
              Website
            </a>
          `
              : ""
          }
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.name + ", " + restaurant.address)}" 
            target="_blank" 
            rel="noopener noreferrer"
            style="
              flex: 1; 
              background: white; 
              color: #374151; 
              border: 1px solid #d1d5db;
              padding: 8px 12px; 
              border-radius: 6px; 
              text-decoration: none; 
              font-size: 14px; 
              font-weight: 500;
              text-align: center;
              display: block;
            "
          >
            Directions
          </a>
        </div>
      </div>
    </div>
  `;
}
