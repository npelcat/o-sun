"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/src/components/Button";
import { FeatureCard } from "@/src/components/FeatureCard";
import { HomeCTA } from "@/src/components/HomeCTA";
import BlockRendererClient from "@/app/api/utilsStrapi/BlockRendererClient";
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
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create the observer to detect visible elements
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1, // Triggers when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Triggers a little before
      }
    );

    // Observe all elements with the "scroll-animate" class
    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [featureCardComponents, homeCTAComponents]);

  return (
    <main>
      {quoteBlock && (
        <section className="mt-16 bg-dark-green bg-opacity-50 overflow-hidden scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
            <h2 className="flex-1 text-xl leading-relaxed text-center md:text-left mb-6 md:mb-0">
              <BlockRendererClient content={quoteBlock.content} />
            </h2>
            {quoteBlock.picture && (
              <Image
                className="flex-shrink-0 w-full max-w-sm md:w-80 lg:w-96 h-48 md:h-56 lg:h-64 rounded-lg object-cover shadow-lg mx-auto md:mx-0 transition-transform duration-300"
                src={quoteBlock.picture.url}
                width={600}
                height={400}
                alt={quoteBlock.picture.alternativeText || "Image"}
                loading="lazy"
              />
            )}
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {homeCTAComponents.map((component, index) => (
              <div
                key={component.slug}
                className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <HomeCTA
                  titleButton={component.title}
                  image={component.picture?.url || ""}
                  link={component.link}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-dark-green to-opacity-10">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <h2 className="text-4xl md:text-5xl font-subtitle font-bold mb-4">
              Mes Services
            </h2>
            <p className="text-lg text-dark-green max-w-2xl mx-auto">
              Découvrez comment je peux vous accompagner
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCardComponents.map((component, index) => (
              <div
                key={component.slug}
                className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out hover:-translate-y-10"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <FeatureCard
                  title={component.title}
                  description={
                    <BlockRendererClient content={component.description} />
                  }
                  image={component.picture?.url || ""}
                  alt={component.picture?.alternativeText || ""}
                  link={component.link}
                  titleButton="En savoir plus"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonialComponent && (
        <section className="relative my-20 overflow-hidden shadow-2xl scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <Image
            className="w-full h-64 object-cover"
            src={testimonialComponent.picture?.url || ""}
            alt={testimonialComponent.picture?.alternativeText || ""}
            width={960}
            height={1280}
          />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Button
              titleButton={testimonialComponent.title}
              link={testimonialComponent.link}
              className="py-4 px-8 md:py-6 md:px-10 bg-opacity-70 hover:bg-opacity-100 text-2xl md:text-3xl z-10 transition-all duration-300 shadow-xl"
            />
          </div>
        </section>
      )}

      <style jsx global>{`
        .scroll-animate {
          transition-property: opacity, transform;
        }

        .scroll-animate.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </main>
  );
}
