"use client";

import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { TableOfContents } from "@/src/components/TableOfContents";
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
    (block) => block.slug === "com-animale-qu-est-ce-que-c-est",
  );
  const whatIsItForContent = blockContents.find(
    (block) => block.slug === "com-animale-a-quoi-ca-sert",
  );
  const whatIsLookLike = blockContents.find(
    (block) => block.slug === "com-animale-a-quoi-ressemble-une-seance",
  );
  const practicalInfosContent = blockContents.find(
    (block) => block.slug === "com-animale-infos-pratiques",
  );

  const practicalInfosAccordions = accordions.filter(
    (accordion) =>
      accordion.slug &&
      ["com-animale-limites", "com-animale-type-de-seance-et-tarifs"].includes(
        accordion.slug,
      ),
  );

  // Table des matières
  const tocItems = [
    whatIsThisContent && {
      id: "quest-ce-que-cest",
      title: whatIsThisContent.title,
    },
    whatIsLookLike && {
      id: "a-quoi-ressemble-une-seance",
      title: whatIsLookLike.title,
    },
    whatIsItForContent && {
      id: "a-quoi-ca-sert",
      title: whatIsItForContent.title,
    },
    practicalInfosContent && {
      id: "infos-pratiques",
      title: practicalInfosContent.title,
    },
  ].filter(Boolean) as { id: string; title: string }[];

  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        La communication animale
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

      {whatIsLookLike && (
        <section
          id="a-quoi-ressemble-une-seance"
          className="flex justify-center bg-beige scroll-mt-24"
        >
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
        </section>
      )}

      {whatIsItForContent && (
        <section
          id="a-quoi-ca-sert"
          className="flex justify-center bg-beige scroll-mt-24"
        >
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
              link="https://linktr.ee/o.sun.voixanimale"
              target="_blank"
              rel="noopener noreferrer"
            />
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
          titleButton="Réserver une communication animale"
          link="https://linktr.ee/o.sun.voixanimale"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  );
}
