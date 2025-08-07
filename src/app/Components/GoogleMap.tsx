"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Restaurant } from "@/lib/types";
import { createRestaurantMarker } from "./GoogleMap/MarkerUtils";
import { generateRestaurantInfoContent } from "./GoogleMap/RestaurantInfoContent";
import { createClusterRenderer } from "./GoogleMap/ClusterRenderer";

interface GoogleMapProps {
  restaurants: Restaurant[];
  restaurantImages?: Record<string, string>; // Pre-loaded image URLs by restaurant ID
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export default function GoogleMap({
  restaurants,
  restaurantImages = {},
  onRestaurantSelect,
  center = { lat: 39.7392, lng: -104.9903 }, // Denver center
  zoom = 12,
  className = "h-96 w-full rounded-lg",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<
    (google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[]
  >([]);
  const markerClustererRef = useRef<MarkerClusterer | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: "weekly",
          libraries: ["places", "marker"],
        });

        await loader.load();
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading Google Maps:", err);
        setError("Failed to load Google Maps");
      }
    };

    initMap();
  }, []);

  // Create map instance
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const mapID =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "denver-happy-hour-map";
    console.log("Map Style ID:", mapID);

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      maxZoom: 18, // Prevent over-zooming
      mapId: mapID, // Required for AdvancedMarkerElement
      // Cloud-styled map with hidden POIs - POI hiding must be configured in Google Cloud Console
      // See CLAUDE.md for setup instructions
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      gestureHandling: "greedy", // Allow scroll zoom without Cmd key
      clickableIcons: false, // Minimal POI interaction disable (visual POIs still show without proper cloud styling)
    });

    // Create info window
    infoWindowRef.current = new google.maps.InfoWindow();
  }, [isLoaded, center, zoom]);

  // Update markers when restaurants change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing clusterer and markers
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
      markerClustererRef.current = null;
    }
    markersRef.current.forEach((marker) => {
      if ("setMap" in marker) {
        (marker as any).setMap(null);
      } else {
        // AdvancedMarkerElement
        (marker as any).map = null;
      }
    });
    markersRef.current = [];

    // Create new markers using extracted utility
    const newMarkers = restaurants
      .filter((restaurant) => restaurant.coordinates)
      .map((restaurant) => {
        const handleMarkerClick = () => {
          if (infoWindowRef.current && mapInstanceRef.current) {
            // Use pre-loaded image data instead of making API call
            const imageUrl = restaurantImages[restaurant.id] || "/photo-missing.webp";

            const content = generateRestaurantInfoContent({
              restaurant,
              imageUrl,
            });

            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }

          onRestaurantSelect?.(restaurant);
        };

        const marker = createRestaurantMarker({
          restaurant,
          map: mapInstanceRef.current!,
          onMarkerClick: handleMarkerClick,
        });

        return marker;
      });

    markersRef.current = newMarkers;

    // Create marker clusterer with less aggressive clustering
    if (newMarkers.length > 0) {
      markerClustererRef.current = new MarkerClusterer({
        map: mapInstanceRef.current,
        markers: newMarkers,
        // Disable clustering at higher zoom levels so individual markers become clickable
        algorithmOptions: {
          maxZoom: 15, // Stop clustering at zoom level 15
        },
        onClusterClick: (_, cluster, map) => {
          // Custom cluster click behavior
          const currentZoom = map.getZoom() || 12;
          const targetZoom = Math.min(currentZoom + 2, 15); // Don't zoom past level 15

          map.setCenter(cluster.position);
          map.setZoom(targetZoom);
        },
        renderer: createClusterRenderer(mapInstanceRef.current!),
      });

      // Adjust map bounds to fit all markers
      const bounds = new google.maps.LatLngBounds();
      restaurants
        .filter((restaurant) => restaurant.coordinates)
        .forEach((restaurant) => {
          bounds.extend({
            lat: restaurant.coordinates!.lat,
            lng: restaurant.coordinates!.lng,
          });
        });

      mapInstanceRef.current.fitBounds(bounds);

      // Ensure minimum zoom level
      google.maps.event.addListenerOnce(
        mapInstanceRef.current,
        "bounds_changed",
        () => {
          const currentZoom = mapInstanceRef.current?.getZoom();
          if (currentZoom && currentZoom > 15) {
            mapInstanceRef.current?.setZoom(15);
          }
        },
      );
    }
  }, [restaurants, restaurantImages, isLoaded, onRestaurantSelect]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100`}
      >
        <div className="text-center">
          <p className="mb-2 text-red-600">Failed to load map</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100`}
      >
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-stone-800"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="MapContainer relative h-full">
      <div ref={mapRef} className={className} />
    </div>
  );
}
