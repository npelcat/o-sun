"use client";

import { Button } from "@/src/components/Button";
import { FeatureCard } from "../src/components/FeatureCard";
import { HomeCTA } from "../src/components/HomeCTA";
import Image from "next/image";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import BlockRendererClient from "./api/utils/BlockRendererClient";
import {
  fetchLinkComponentById,
  fetchMultipleLinkComponents,
} from "./api/strapi/fetchers/link-component";
import { useEffect, useState } from "react";
import { StrapiBlockContent, StrapiLinkComponent } from "./api/types/strapi";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import Loader from "@/src/components/Loader";

export default function Home() {
  const [quoteBlock, setQuoteBlock] = useState<StrapiBlockContent | null>(null);
  const [homeCTAComponents, setHomeCTAComponents] = useState<
    StrapiLinkComponent[]
  >([]);
  const [featureCardComponents, setFeatureCardComponents] = useState<
    StrapiLinkComponent[]
  >([]);
  const [testimonialComponent, setTestimonialComponent] =
    useState<StrapiLinkComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quoteBlockId = "jurx7g9k98qkycxylf0ovvvo";
        const homeCTASlugs = ["qui-suis-je", "mon-ethique", "reservation"];
        const featureCardSlugs = [
          "la-communication-animale",
          "les-soins-energetiques",
          "pour-les-gardiens",
        ];
        const testimonialComponentId = "jjjr5w6ef328auwy65kxwsta";

        const [quote, homeCTAs, featureCards, testimonial] = await Promise.all([
          fetchBlockContentById(quoteBlockId),
          fetchMultipleLinkComponents(homeCTASlugs),
          fetchMultipleLinkComponents(featureCardSlugs),
          fetchLinkComponentById(testimonialComponentId),
        ]);

        setQuoteBlock(quote);
        setHomeCTAComponents(homeCTAs);
        setFeatureCardComponents(featureCards);
        setTestimonialComponent(testimonial);
      } catch (error) {
        setError("Une erreur s'est produite lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  if (error)
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );

  return (
    <main>
      {quoteBlock && (
        <section className="pt-24">
          <div className="bg-dark-green bg-opacity-50 py-5 sm:py-10 w-full">
            <div className="max-w-[800px] mx-auto flex flex-col items-center px-5">
              <h2 className="pb-3 text-center">
                <BlockRendererClient content={quoteBlock.content} />
              </h2>
              {quoteBlock.picture && (
                <Image
                  className="w-48 h-24 md:w-64 md:h-32 lg:w-72 lg:h-36 rounded-lg object-cover mt-4"
                  src={quoteBlock.picture?.url || ""}
                  width={600}
                  height={400}
                  alt={quoteBlock.picture?.alternativeText || "Image"}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-16">
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

      <section className="text-center mt-4">
        <h2 className="text-3xl pt-16 pb-5 font-subtitle font-bold">
          Mes Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
        <section>
          <div className="relative">
            <Image
              className="w-full h-56 object-cover my-24"
              src={testimonialComponent.picture?.url || ""}
              alt={testimonialComponent.picture?.alternativeText || ""}
              width={960}
              height={1280}
            />
            <Button
              titleButton={testimonialComponent.title}
              link={testimonialComponent.link}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-6 px-10 bg-opacity-70 text-3xl"
            />
          </div>
        </section>
      )}
    </main>
  );
}
