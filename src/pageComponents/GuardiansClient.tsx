"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

interface GuardiansClientProps {
  blockContents: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

export default function GuardiansClient({
  blockContents,
  accordions,
}: GuardiansClientProps) {
  const whatAreTheyContent = blockContents.find(
    (block) => block.slug === "gardiens-quels-sont-ils"
  );
  const whatIsItForContent = blockContents.find(
    (block) => block.slug === "gardiens-a-quoi-ca-sert"
  );
  const practicalInfosContent = blockContents.find(
    (block) => block.slug === "gardiens-infos-pratiques"
  );

  const practicalInfosAccordions = accordions.filter(
    (accordion) =>
      accordion.slug &&
      [
        "en-pratique-premier-service",
        "en-pratique-deuxieme-service",
        "gardiens-type-de-seance-et-tarifs",
      ].includes(accordion.slug)
  );

  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Services aux gardiens
      </h2>

      {whatAreTheyContent && (
        <div className="flex justify-center bg-beige">
          <div className="py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={whatAreTheyContent.title}
              image={whatAreTheyContent.picture?.url || ""}
              alt={whatAreTheyContent.picture?.alternativeText || ""}
            />
            <div className="text-justify pb-10">
              <BlockRendererClient content={whatAreTheyContent.content} />
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
              titleButton="Réserver un service pour moi"
              link="https://calendly.com/o-sun-voixanimale"
              target="_blank"
              rel="noopener noreferrer"
            />
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
          titleButton="Réserver une Moon Guidance ou un soin énergétique humain"
          link="https://calendly.com/o-sun-voixanimale"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  );
}
