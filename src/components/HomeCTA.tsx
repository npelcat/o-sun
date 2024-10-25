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
        lien={lien}
        titleButton={titleButton}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
      />
    </div>
  );
};
