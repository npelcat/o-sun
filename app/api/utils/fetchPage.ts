import { fetchMultipleAccordions } from "../strapi/accordion";
import { fetchBlockContentById } from "../strapi/block-content";

export const fetchBlockContentAndAccordions = async (
  blockIds: string[],
  accordionSlugs: string[]
) => {
  const [responseAccordions, responsesBlockContent] = await Promise.all([
    fetchMultipleAccordions(accordionSlugs),
    Promise.all(blockIds.map((id) => fetchBlockContentById(id))),
  ]);

  const validBlockContents = responsesBlockContent.filter(
    (content) => content !== null
  );

  return {
    blockContents: validBlockContents,
    accordions: responseAccordions,
  };
};

export const fetchTestimonials = async () => {};
