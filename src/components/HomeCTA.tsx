import Image from "next/image";
import { Button } from "./Button";

interface HomeCTAInterface {
  image: string;
  titleButton: string;
  lien: string;
}

export const HomeCTA: React.FC<HomeCTAInterface> = ({
  image,
  titleButton,
  lien,
}) => {
  return (
    <div className="relative w-56 h-56 flex items-center justify-center m-5">
      <Image
        className="absolute inset-0 h-full object-cover rounded-full"
        loading="lazy"
        src={image}
        alt={`Image représentant le lien vers la page ${titleButton}`}
        width="400"
        height="600"
      />
      <Button
        link={lien}
        titleButton={titleButton}
        className="flex justify-center items-center m-4 text-xl text-white bg-dark-green bg-opacity-70 font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2 absolute bottom-2 z-50"
      />
    </div>
  );
};
