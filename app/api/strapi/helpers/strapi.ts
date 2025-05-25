export const fetchFromStrapi = async (endpoint: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    const fullUrl = `${baseUrl}${endpoint}`;

    const response = await fetch(fullUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Erreur Strapi :", error);

    return {
      data: [],
      meta: { pagination: { total: 0 } },
    };
  }
};
