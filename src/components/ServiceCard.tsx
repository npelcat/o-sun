import Image from "next/image";
import { ReactNode } from "react";
import { Button } from "./Button";

interface ServiceCardProps {
  title: string;
  description: string | ReactNode;
  image: string;
  alt: string;
  link: string;
  titleButton: string;
  icon?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  alt,
  link,
  titleButton,
  icon,
}) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out h-full flex flex-col transform hover:-translate-y-2">
      {/* Image with overlay on hover */}
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        <Image
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          src={image}
          alt={alt}
          width="600"
          height="400"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-green/60 via-dark-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Icon badge if provided */}
        {icon && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-md">
            {icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <h3 className="text-2xl font-subtitle font-bold text-dark-green mb-3">
          {title}
        </h3>
        <div className="text-base text-black leading-relaxed mb-6 flex-1">
          {description}
        </div>
      </div>

      {/* CTA Button - Centré */}
      <div className="px-6 pb-6 flex justify-center">
        <Button
          titleButton={titleButton}
          link={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${titleButton} - ${title}`}
        />
      </div>
    </article>
  );
};
