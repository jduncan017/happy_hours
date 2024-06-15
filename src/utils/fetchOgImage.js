export const fetchOgImage = async (url) => {
  try {
    const res = await fetch(`/api/fetchImage`, {
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
