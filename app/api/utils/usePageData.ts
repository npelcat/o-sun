// src/hooks/usePageData.ts
import { useEffect, useState } from "react";
import { fetchPageData } from "../utils/fetchPageData";
import { StrapiBlockContent } from "../types/strapi";

interface UsePageDataResult {
  blockContents: StrapiBlockContent[] | null;
  accordions: StrapiBlockContent[] | null;
  error: string | null;
}

const usePageData = (
  blockIds: string[],
  accordionSlugs: string[]
): UsePageDataResult => {
  const [data, setData] = useState<{
    blockContents: StrapiBlockContent[] | null;
    accordions: StrapiBlockContent[] | null;
  }>({
    blockContents: null,
    accordions: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { blockContents, accordions } = await fetchPageData(
          blockIds,
          accordionSlugs
        );
        setData({ blockContents, accordions });
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, [blockIds, accordionSlugs]);

  return { ...data, error };
};

export default usePageData;
