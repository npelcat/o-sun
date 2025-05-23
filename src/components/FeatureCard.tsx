import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./Button";

interface FeatureCardInterface {
  title: string;
  description: string | ReactNode;
  image: string;
  alt: string;
  link: string;
  titleButton: string;
}

export const FeatureCard: React.FC<FeatureCardInterface> = ({
  title,
  description,
  image,
  alt,
  link,
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
          <div className="text-sm text-justify">{description}</div>
        </div>
      </div>

      <div className="flex space-x-4 mb-5 justify-center">
        <Button
          titleButton={titleButton}
          link={link}
          aria-label={titleButton}
        />
      </div>
    </section>
  );
};
