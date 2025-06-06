"use client";
import Image from "next/image";
import { Button } from "@/src/components/Button";
import { FeatureCard } from "@/src/components/FeatureCard";
import { HomeCTA } from "@/src/components/HomeCTA";
import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import {
  StrapiBlockContent,
  StrapiLinkComponent,
} from "@/app/api/types/strapi";

interface HomeClientProps {
  quoteBlock: StrapiBlockContent | null;
  homeCTAComponents: StrapiLinkComponent[];
  featureCardComponents: StrapiLinkComponent[];
  testimonialComponent: StrapiLinkComponent | null;
}

export default function HomeClient({
  quoteBlock,
  homeCTAComponents,
  featureCardComponents,
  testimonialComponent,
}: HomeClientProps) {
  return (
    <main>
      {quoteBlock && (
        <section className="mt-16 bg-dark-green bg-opacity-50">
          <div className="max-w-3xl mx-auto p-4 text-center">
            <h2>
              <BlockRendererClient content={quoteBlock.content} />
            </h2>
            {quoteBlock.picture && (
              <Image
                className="w-48 h-24 md:w-64 md:h-32 lg:w-72 lg:h-36 rounded-lg object-cover m-4 mx-auto"
                src={quoteBlock.picture?.url || ""}
                width={600}
                height={400}
                alt={quoteBlock.picture?.alternativeText || "Image"}
                loading="lazy"
              />
            )}
          </div>
        </section>
      )}

      <section>
        <div className="flex flex-wrap items-center justify-center mt-24">
          {homeCTAComponents.map((component) => (
            <HomeCTA
              key={component.slug}
              titleButton={component.title}
              image={component.picture?.url || ""}
              link={component.link}
            />
          ))}
        </div>
      </section>

      <section className="text-center py-16 px-6">
        <h2 className="text-3xl py-12 font-subtitle font-bold">Mes Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCardComponents.map((component) => (
            <FeatureCard
              key={component.slug}
              title={component.title}
              description={
                <BlockRendererClient content={component.description} />
              }
              image={component.picture?.url || ""}
              alt={component.picture?.alternativeText || ""}
              link={component.link}
              titleButton="En savoir plus"
            />
          ))}
        </div>
      </section>

      {testimonialComponent && (
        <section className="relative my-16">
          <Image
            className="w-full h-56 object-cover"
            src={testimonialComponent.picture?.url || ""}
            alt={testimonialComponent.picture?.alternativeText || ""}
            width={960}
            height={1280}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              titleButton={testimonialComponent.title}
              link={testimonialComponent.link}
              className="py-6 px-10 bg-opacity-60 text-3xl z-10"
            />
          </div>
        </section>
      )}
    </main>
  );
}
