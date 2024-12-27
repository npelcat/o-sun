export const fetchFromStrapi = async (endpoint: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}`
    );

    if (!response.ok) {
      throw new Error(`Erreur lors de l'appel à ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de Strapi:",
      error
    );
    throw error;
  }
};
