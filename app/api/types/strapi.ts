export interface StrapiBlockContent {
  documentId: string;
  title: string;
  picture?: {
    url: string;
    alternativeText?: string | null;
  } | null;
  content: string;
}
