export const formatPicture = (picture: any) =>
  picture
    ? {
        url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${picture.url}`,
        alternativeText: picture.alternativeText || null,
      }
    : null;
