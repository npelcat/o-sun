import { BlocksContent } from "@strapi/blocks-react-renderer";
export interface StrapiPicture {
  url: string;
  alternativeText?: string | null;
}

export interface StrapiContentBase {
  documentId?: string;
  title: string;
  slug?: string;
}

export interface StrapiBlockContent extends StrapiContentBase {
  picture?: StrapiPicture | null;
  content: BlocksContent;
}

export interface StrapiLinkComponent extends StrapiContentBase {
  picture?: StrapiPicture | null;
  link: string;
  description: BlocksContent;
}

export interface StrapiTestimonials extends StrapiContentBase {
  picture: StrapiPicture | null;
  content: BlocksContent;
  author: string;
  createdat: Date;
}
