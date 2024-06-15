import Image from "next/image";
import Link from "next/link";

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
      <button className="absolute bottom-8 z-50 text-2xl text-dark-green bg-white font-subtitle bg-opacity-70 rounded-full p-2 text-center transition duration-300 ease-in-out hover:bg-white">
        <Link href={lien}>{titleButton}</Link>
      </button>

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
