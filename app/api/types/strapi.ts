import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiBlockContent {
  documentId: string;
  title: string;
  picture?: {
    url: string;
    alternativeText?: string | null;
  } | null;
  content: BlocksContent;
  slug: string;
}

export interface StrapiTestimonials {
  title: string;
  picture: {
    url: string;
    alternativeText?: string | null;
  } | null;
  content: BlocksContent;
  author: string;
  createdat: Date;
  slug?: string;
}
