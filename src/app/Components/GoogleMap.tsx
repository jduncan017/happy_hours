"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Restaurant } from '@/lib/types';

interface GoogleMapProps {
  restaurants: Restaurant[];
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export default function GoogleMap({
  restaurants,
  onRestaurantSelect,
  center = { lat: 39.7392, lng: -104.9903 }, // Denver center
  zoom = 12,
  className = "h-96 w-full rounded-lg"
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
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
          libraries: ["places"]
        });

        await loader.load();
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps');
      }
    };

    initMap();
  }, []);

  // Create map instance
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      maxZoom: 18, // Prevent over-zooming
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
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
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    const newMarkers = restaurants
      .filter(restaurant => restaurant.coordinates)
      .map(restaurant => {
        const marker = new google.maps.Marker({
          position: {
            lat: restaurant.coordinates!.lat,
            lng: restaurant.coordinates!.lng
          },
          title: restaurant.name,
          icon: {
            url: '/marker-icon.svg',
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 32)
          }
        });

        // Add click listener
        marker.addListener('click', () => {
          // Close any open info window
          infoWindowRef.current?.close();

          // Create info window content
          const content = `
            <div class="p-3 min-w-[200px]">
              <h3 class="font-bold text-lg mb-2">${restaurant.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${restaurant.address}</p>
              ${restaurant.area ? `<p class="text-xs text-gray-500 mb-2">${restaurant.area}</p>` : ''}
              <div class="flex gap-2 mt-3">
                <a 
                  href="${restaurant.website}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-xs bg-stone-800 text-white px-2 py-1 rounded hover:bg-stone-700"
                >
                  Website
                </a>
                <button 
                  onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address)}', '_blank')"
                  class="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                >
                  Directions
                </button>
              </div>
            </div>
          `;

          infoWindowRef.current?.setContent(content);
          infoWindowRef.current?.open(mapInstanceRef.current, marker);

          // Notify parent component
          onRestaurantSelect?.(restaurant);
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
        renderer: {
          render: ({ count, position }) => {
            const color = count > 10 ? "#dc2626" : count > 5 ? "#ea580c" : "#ea580c";
            const size = count > 10 ? 50 : count > 5 ? 45 : 40;
            
            // Create a DOM element for the cluster marker
            const clusterDiv = document.createElement('div');
            clusterDiv.style.cssText = `
              width: ${size}px;
              height: ${size}px;
              background-color: ${color};
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: ${size/3}px;
              font-family: Arial, sans-serif;
              cursor: pointer;
              z-index: ${1000 + count};
            `;
            clusterDiv.textContent = count.toString();

            const clusterMarker = new google.maps.marker.AdvancedMarkerElement({
              position,
              content: clusterDiv,
            });

            // Add custom click behavior to prevent over-zooming
            clusterMarker.addListener('click', () => {
              const currentZoom = mapInstanceRef.current?.getZoom() || 12;
              const targetZoom = Math.min(currentZoom + 2, 15); // Don't zoom past level 15
              
              mapInstanceRef.current?.setCenter(position);
              mapInstanceRef.current?.setZoom(targetZoom);
            });

            return clusterMarker;
          }
        }
      });

      // Adjust map bounds to fit all markers
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      
      mapInstanceRef.current.fitBounds(bounds);
      
      // Ensure minimum zoom level
      google.maps.event.addListenerOnce(mapInstanceRef.current, 'bounds_changed', () => {
        const currentZoom = mapInstanceRef.current?.getZoom();
        if (currentZoom && currentZoom > 15) {
          mapInstanceRef.current?.setZoom(15);
        }
      });
    }
  }, [restaurants, isLoaded, onRestaurantSelect]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg`}>
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load map</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}