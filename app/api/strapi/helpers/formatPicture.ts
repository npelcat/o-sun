export const formatPicture = (picture: any) =>
  picture
    ? {
        url: `${picture.url}`,
        alternativeText: picture.alternativeText || null,
      }
    : null;
