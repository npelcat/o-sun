"use client";

import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import BlockRendererClient from "@/app/api/utilsStrapi/BlockRendererClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

interface AnimalCommunicationClientProps {
  blockContents: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

export default function AnimalCommunicationClient({
  blockContents,
  accordions,
}: AnimalCommunicationClientProps) {
  const whatIsThisContent = blockContents.find(
    (block) => block.slug === "com-animale-qu-est-ce-que-c-est"
  );
  const whatIsItForContent = blockContents.find(
    (block) => block.slug === "com-animale-a-quoi-ca-sert"
  );
  const whatIsLookLike = blockContents.find(
    (block) => block.slug === "com-animale-a-quoi-ressemble-une-seance"
  );
  const practicalInfosContent = blockContents.find(
    (block) => block.slug === "com-animale-infos-pratiques"
  );

  const practicalInfosAccordions = accordions.filter(
    (accordion) =>
      accordion.slug &&
      ["com-animale-limites", "com-animale-type-de-seance-et-tarifs"].includes(
        accordion.slug
      )
  );

  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        La communication animale
      </h2>

      {whatIsThisContent && (
        <div className="flex justify-center bg-beige">
          <div className="py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={whatIsThisContent.title}
              image={whatIsThisContent.picture?.url || ""}
              alt={whatIsThisContent.picture?.alternativeText || ""}
            />
            <div className="text-justify pb-10">
              <BlockRendererClient content={whatIsThisContent.content} />
            </div>
            <Button
              titleButton="Ma façon de travailler et mon éthique"
              link="/about/ethics"
            />
          </div>
        </div>
      )}

      {whatIsItForContent && (
        <div className="flex justify-center bg-beige">
          <div className="py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={whatIsItForContent.title}
              image={whatIsItForContent.picture?.url || ""}
              alt={whatIsItForContent.picture?.alternativeText || ""}
            />
            <div className="text-justify pb-10">
              <BlockRendererClient content={whatIsItForContent.content} />
            </div>
            <Button
              titleButton="Réserver une communication"
              link="https://calendly.com/o-sun-voixanimale"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      )}

      {whatIsLookLike && (
        <div className="flex justify-center bg-beige">
          <div className="py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={whatIsLookLike.title}
              image={whatIsLookLike.picture?.url || ""}
              alt={whatIsLookLike.picture?.alternativeText || ""}
            />
            <div className="text-justify">
              <BlockRendererClient content={whatIsLookLike.content} />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center bg-dark-beige">
        <div className="py-8 w-full md:w-3/5 px-4">
          {practicalInfosContent && (
            <>
              <CardTitlePhoto
                title={practicalInfosContent.title}
                image={practicalInfosContent.picture?.url || ""}
                alt={practicalInfosContent.picture?.alternativeText || ""}
              />
              <div className="text-justify">
                {practicalInfosAccordions.map((accordion) => (
                  <Accordion key={accordion.slug} title={accordion.title}>
                    <BlockRendererClient content={accordion.content} />
                  </Accordion>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver une communication animale"
          link="https://calendly.com/o-sun-voixanimale"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  );
}
