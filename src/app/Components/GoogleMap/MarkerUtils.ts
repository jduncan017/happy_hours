import type { Restaurant } from "@/lib/types";

interface CreateMarkerOptions {
  restaurant: Restaurant;
  map: google.maps.Map;
  onMarkerClick: (restaurant: Restaurant) => void;
}

export function createRestaurantMarker({
  restaurant,
  map,
  onMarkerClick,
}: CreateMarkerOptions): google.maps.marker.AdvancedMarkerElement | google.maps.Marker {
  let marker;

  if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
    // Use AdvancedMarkerElement
    const markerDiv = document.createElement("div");
    markerDiv.style.cssText = `
      width: 32px;
      height: 32px;
      background-image: url('/marker-icon.svg');
      background-size: cover;
      background-position: center;
      cursor: pointer;
      pointer-events: auto;
    `;

    marker = new google.maps.marker.AdvancedMarkerElement({
      position: {
        lat: restaurant.coordinates!.lat,
        lng: restaurant.coordinates!.lng,
      },
      content: markerDiv,
      title: restaurant.name,
      map: map,
    });
  } else {
    // Fallback to regular Marker
    marker = new google.maps.Marker({
      position: {
        lat: restaurant.coordinates!.lat,
        lng: restaurant.coordinates!.lng,
      },
      title: restaurant.name,
      icon: {
        url: "/marker-icon.svg",
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32),
      },
      map: map,
    });
  }

  // Add restaurant ID to marker for clustering tracking
  (marker as any).__restaurantId = restaurant.id.toString();

  // Add click handler
  marker.addListener("click", () => {
    onMarkerClick(restaurant);
  });

  return marker;
}