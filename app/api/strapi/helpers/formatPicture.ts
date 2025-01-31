export const formatPicture = (picture: any) =>
  picture
    ? {
        url: `${process.env.NEXT_PUBLIC_API_URL}${picture.url}`,
        alternativeText: picture.alternativeText || null,
      }
    : null;
