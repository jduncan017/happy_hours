// Used to generate a url search for googlemaps links. Specifically targets restaurants in this case.
export default function generateGoogleMapsUrl(
  restaurantName: string,
  city: string,
): string {
  const baseUrl = "https://www.google.com/maps/search/?api=1&query=";
  const query = `${restaurantName}, ${city}`;
  const encodedQuery = encodeURIComponent(query);
  return `${baseUrl}${encodedQuery}`;
}
