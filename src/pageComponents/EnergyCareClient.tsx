"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { TableOfContents } from "@/src/components/TableOfContents";
import BlockRendererClient from "@/app/api/strapi/helpers/BlockRendererClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

interface EnergyCareClientProps {
  blockContents: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

export default function EnergyCareClient({
  blockContents,
  accordions,
}: EnergyCareClientProps) {
  const whatIsThisContent = blockContents.find(
    (block) => block.slug === "soins-energetiques-qu-est-ce-que-c-est",
  );
  const whatEffectsContent = blockContents.find(
    (block) => block.slug === "quels-sont-les-effets-d-une-seance-energetique",
  );
  const onWhatContent = blockContents.find(
    (block) => block.slug === "sur-quoi-agit-une-seance-energetique",
  );
  const practicalInfosContent = blockContents.find(
    (block) => block.slug === "soins-energetiques-infos-pratiques",
  );

  const practicalInfosAccordions = accordions.filter(
    (accordion) =>
      accordion.slug &&
      [
        "a-qui-s-adresse-mes-soins-energetiques",
        "soins-energetiques-une-seance-en-pratique",
        "soins-energetiques-type-de-seance-et-tarifs",
      ].includes(accordion.slug),
  );

  // Table des matières
  const tocItems = [
    whatIsThisContent && {
      id: "quest-ce-que-cest",
      title: whatIsThisContent.title,
    },
    whatEffectsContent && {
      id: "quels-effets",
      title: whatEffectsContent.title,
    },
    onWhatContent && {
      id: "sur-quoi-agit",
      title: onWhatContent.title,
    },
    practicalInfosContent && {
      id: "infos-pratiques",
      title: practicalInfosContent.title,
    },
  ].filter(Boolean) as { id: string; title: string }[];

  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 font-subtitle font-bold">
        Les soins énergétiques
      </h2>

      {/* Table des matières */}
      {tocItems.length > 0 && <TableOfContents items={tocItems} />}

      {whatIsThisContent && (
        <section
          id="quest-ce-que-cest"
          className="flex justify-center bg-beige scroll-mt-24"
        >
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
        </section>
      )}

      {whatEffectsContent && (
        <section
          id="quels-effets"
          className="flex justify-center bg-beige scroll-mt-24"
        >
          <div className="py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={whatEffectsContent.title}
              image={whatEffectsContent.picture?.url || ""}
              alt={whatEffectsContent.picture?.alternativeText || ""}
            />
            <div className="text-justify pb-10">
              <BlockRendererClient content={whatEffectsContent.content} />
            </div>
            <Button
              titleButton="Réserver un soin énergétique"
              link="https://form.jotform.com/252464023594356"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </section>
      )}

      {onWhatContent && (
        <section
          id="sur-quoi-agit"
          className="flex justify-center bg-beige scroll-mt-24"
        >
          <div className="text-justify py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={onWhatContent.title}
              image={onWhatContent.picture?.url || ""}
              alt={onWhatContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={onWhatContent.content} />
          </div>
        </section>
      )}

      <section
        id="infos-pratiques"
        className="flex justify-center bg-green scroll-mt-24"
      >
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
      </section>

      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver un soin énergétique"
          link="https://form.jotform.com/252464023594356"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  );
}
