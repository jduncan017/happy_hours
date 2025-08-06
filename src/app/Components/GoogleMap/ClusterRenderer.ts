interface ClusterRenderOptions {
  count: number;
  position: google.maps.LatLng;
  markers: (google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[];
}

export function createClusterRenderer(
  mapInstance: google.maps.Map,
): {
  render: (options: ClusterRenderOptions) => google.maps.marker.AdvancedMarkerElement | google.maps.Marker;
} {
  return {
    render: ({ count, position, markers }) => {
      // Use theme colors: pr1 for red, po1 for orange
      const color =
        count > 10 ? "#db3702" : count > 5 ? "#ff8f28" : "#ff8f28";
      const size = count > 10 ? 50 : count > 5 ? 45 : 40;

      // When clustering occurs, hide the individual markers by setting their map to null
      markers.forEach((marker) => {
        if ("setMap" in marker) {
          (marker as any).setMap(null);
        } else {
          // AdvancedMarkerElement
          (marker as any).map = null;
        }
      });

      // Try to use AdvancedMarkerElement if available, otherwise fall back to regular Marker
      if (
        google.maps.marker &&
        google.maps.marker.AdvancedMarkerElement
      ) {
        // Create a DOM element for the cluster marker
        const clusterDiv = document.createElement("div");
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
          font-size: ${size / 3}px;
          font-family: Arial, sans-serif;
          cursor: pointer;
          z-index: ${1000 + count};
        `;
        clusterDiv.textContent = count.toString();

        const clusterMarker =
          new google.maps.marker.AdvancedMarkerElement({
            position,
            content: clusterDiv,
            zIndex: 1000 + count, // Ensure clusters are above individual markers
          });

        return clusterMarker;
      } else {
        // Fallback to regular Marker with SVG icon
        const clusterMarker = new google.maps.Marker({
          position,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${color}" stroke="white" stroke-width="2"/>
                <text x="${size / 2}" y="${size / 2 + size / 8}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size / 3}" font-weight="bold">${count}</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(size, size),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(size / 2, size / 2),
          },
          map: mapInstance,
          zIndex: 1000 + count, // Ensure clusters are above individual markers
        });

        return clusterMarker;
      }
    },
  };
}