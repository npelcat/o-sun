import Image from "next/image";
import Link from "next/link";

interface FeatureCardInterface {
  title: string;
  description: string;
  image: string;
  alt: string;
  lien: string;
  titleButton: string;
}

export const FeatureCard: React.FC<FeatureCardInterface> = ({
  title,
  description,
  image,
  alt,
  lien,
  titleButton,
}) => {
  return (
    <section className="flex flex-col bg-beige p-4 rounded-lg items-center w-full">
      <div className="relative w-full h-56 flex flex-col items-center justify-center">
        <h3
          className="absolute bottom-2 z-50 text-2xl text-dark-green bg-white font-subtitle bg-opacity-75 w-full p-2 text-center"
          aria-level={3}
        >
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
      <div className="flex-auto p-4">
        <div className="flex flex-wrap justify-center">
          <div className="text-sm text-center">{description}</div>
        </div>
      </div>

      <div className="flex space-x-4 mb-5 text-sm font-medium justify-center">
        <div className="flex-auto flex space-x-4 justify-center">
          <Link
            href={lien}
            className="h-10 px-6 font-semibold rounded-full bg-dark-green text-white transition duration-300 ease-in-out hover:bg-white hover:text-dark-green flex items-center justify-center"
            aria-label={titleButton}
          >
            {titleButton}
          </Link>
        </div>
      </div>
    </section>
  );
};
