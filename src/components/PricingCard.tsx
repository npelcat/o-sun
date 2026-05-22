"use client";

import BlockRendererClient from "@/app/api/strapi/helpers/BlockRendererClient";
import { Button } from "@/src/components/Button";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface PricingCardProps {
  title: string;
  subtitle?: string;
  price: string;
  badge?: string;
  description: BlocksContent;
  link: string;
  titleButton?: string;
  highlight?: boolean;
  picture?: { url: string; alternativeText?: string | null | undefined } | null;
}

export function PricingCard({
  title,
  subtitle,
  price,
  badge,
  description,
  link,
  titleButton = "Réserver",
  highlight = false,
  picture,
}: PricingCardProps) {
  return (
    <article
      className={`
        relative flex flex-col rounded-2xl p-6 md:p-8 shadow-lg transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        ${
          highlight
            ? "bg-green text-black ring-2 ring-green"
            : "bg-white/70 backdrop-blur-sm text-black"
        }
      `}
    >
      {/* Badge */}
      {badge && (
        <span
          className={`
            absolute -top-3 left-1/2 -translate-x-1/2
            px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow
            ${highlight ? "bg-dark-green text-white" : "bg-dark-green text-white"}
          `}
        >
          {badge}
        </span>
      )}

      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className={`text-xl font-subtitle font-bold mb-1 text-dark-green`}>
          {title}
        </h3>
        {subtitle && <p className={"text-sm text-dark-green/70"}>{subtitle}</p>}
        <p className={`mt-3 text-3xl font-bold font-subtitle text-dark-green`}>
          {price}
        </p>
      </div>

      {/* Image */}
      {picture?.url && (
        <div className="relative w-full rounded-2xl h-44 shrink-0 overflow-hidden">
          <Image
            src={picture.url}
            alt={picture.alternativeText || title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}

      {/* Divider */}
      <div className={`h-px my-4 bg-dark-green/15`} />

      {/* Description (rich text — inclus list) */}
      <div
        className={`flex-1 text-sm leading-relaxed prose prose-sm max-w-none mb-6 prose-li:marker:text-dark-green`}
      >
        <BlockRendererClient content={description} />
      </div>

      {/* CTA */}
      <div className="mt-auto text-center">
        <Button
          titleButton={titleButton}
          link={link}
          className={
            highlight
              ? "hover:bg-white/90 w-full justify-center"
              : "w-full justify-center"
          }
        />
      </div>
    </article>
  );
}
