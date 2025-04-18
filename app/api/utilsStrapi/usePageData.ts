// src/hooks/usePageData.ts
import { useEffect, useState } from "react";
import { fetchMultipleAccordions } from "../strapi/fetchers/accordion";
import { fetchBlockContentById } from "../strapi/fetchers/block-content";
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
      if (data.blockContents !== null && data.accordions !== null) {
        return;
      }

      try {
        const [accordions, blockContents] = await Promise.all([
          fetchMultipleAccordions(accordionSlugs),
          Promise.all(blockIds.map(fetchBlockContentById)),
        ]);

        const validBlockContents = blockContents.filter(
          (block): block is StrapiBlockContent =>
            block !== null && block !== undefined
        );

        setData({ blockContents: validBlockContents, accordions });
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, [blockIds, accordionSlugs, data.blockContents, data.accordions]);

  return { ...data, error };
};

export default usePageData;
