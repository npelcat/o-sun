import Image from "next/image";

interface CardTitlePhotoInterface {
  title: string;
  image: string;
  alt: string;
}

export const CardTitlePhoto: React.FC<CardTitlePhotoInterface> = ({
  title,
  image,
  alt,
}) => {
  return (
    <div className="relative w-full h-96 md:h- flex flex-col items-center justify-center">
      <h3 className="absolute bottom-2 z-50 text-2xl text-black bg-white font-subtitle bg-opacity-70 w-full p-2 m-2 text-center">
        {title}
      </h3>

      <Image
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
        loading="lazy"
        src={image}
        alt={alt}
        width="400"
        height="600"
      />
    </div>
  );
};
