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
    <section className="bg-beige rounded-lg overflow-hidden h-full flex flex-col">
      <div className="relative h-56">
        <h3
          className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 text-dark-green text-2xl font-subtitle p-2 text-center"
          aria-level={3}
        >
          {title}
        </h3>

        <Image
          className="w-full h-full object-cover"
          loading="lazy"
          src={image}
          alt={alt}
          width="400"
          height="600"
        />
      </div>
      <div className="flex-1 p-4">
        <div className="text-sm text-justify mb-4">{description}</div>
      </div>

      <div className="flex space-x-4 pb-5 justify-center">
        <Button
          titleButton={titleButton}
          link={link}
          aria-label={titleButton}
        />
      </div>
    </section>
  );
};
