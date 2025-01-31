export const fetchFromStrapi = async (endpoint: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Erreur dans fetchFromStrapi :", error);
    throw error;
  }
};
