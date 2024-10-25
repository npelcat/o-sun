import Image from "next/image";
import Link from "next/link";
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
      <Button lien="/ton-lien" titleButton="Qui suis-je ?" />

      <Image
        className="absolute inset-0 h-full object-cover rounded-full"
        loading="lazy"
        src={image}
        alt={titleButton}
        width="4000"
        height="6000"
      />
    </div>
  );
};
