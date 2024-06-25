import Image from "next/image";

interface CardTitlePhotoInterface {
  title: string;
  image: string;
}

export const CardTitlePhoto: React.FC<CardTitlePhotoInterface> = ({
  title,
  image,
}) => {
  return (
    <div className="relative w-full h-96 md:h- flex flex-col items-center justify-center">
      <h3 className="absolute bottom-2 z-50 text-2xl text-dark-green bg-white font-subtitle bg-opacity-70 rounded-lg p-2 text-center">
        {title}
      </h3>

      <Image
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
        loading="lazy"
        src={image}
        alt={title}
        width="4000"
        height="6000"
      />
    </div>
  );
};
