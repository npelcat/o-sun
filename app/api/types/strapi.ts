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
