export const fetchOgImage = async (url) => {
  try {
    // Use absolute URL for server-side fetches
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/fetchImage`, {
      method: "GET",
      headers: { xurl: url },
    });
    if (!res.ok) {
      throw new Error(`Fetch failed with status: ${res.status}`);
    }
    const data = await res.json();
    return data.ogImageUrl;
  } catch (error) {
    throw new Error(`An error occurred: ${error}`);
  }
};
