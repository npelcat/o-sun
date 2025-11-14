type PictureLike = {
  url: string;
  alternativeText?: string | null;
} | null | undefined;

export const formatPicture = (picture: PictureLike) =>
  picture
    ? {
        url: `${picture.url}`,
        alternativeText: picture.alternativeText ?? null,
      }
    : null;
