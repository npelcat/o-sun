export const fetchFromStrapi = async (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  const fullUrl = `${baseUrl}${endpoint}`;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined. Check your environment variables."
    );
  }

  const response = await fetch(fullUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Strapi fetch failed: HTTP ${response.status}`);
  }

  return response.json();
};
