"use client";

import { Button } from "@/src/components/Button";
import { NextPage } from "next";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import BlockRendererClient from "../api/utils/BlockRendererClient";
import usePageData from "../api/utils/usePageData";

const ServicesIndex: NextPage = () => {
  const blockIds = [
    "gq45qnh9mzp7frix51cm1iad",
    "rbmsw4youqj5y8dis9eaordk",
    "n418rbmlpib4cb94h0kqv00j",
  ];
  const accordionSlugs = [
    "avec-qui-puis-je-communiquer",
    "com-animale-une-seance-en-pratique",
    "com-animale-type-de-seance-et-tarifs",
    "com-animale-les-packs",
  ];

  const { blockContents, accordions, error } = usePageData(
    blockIds,
    accordionSlugs
  );

  if (error) return <p className="text-red-500">{error}</p>;
  if (!blockContents || !accordions) return <p>Chargement des données...</p>;

  const whatIsThisContent = blockContents.find(
    (block) => block.slug === "com-animale-qu-est-ce-que-c-est"
  );
  const whatIsItForContent = blockContents.find(
    (block) => block.slug === "com-animale-a-quoi-ca-sert"
  );
  const practicalInfosContent = blockContents.find(
    (block) => block.slug === "com-animale-infos-pratiques"
  );

  const practicalInfosAccordions = accordions.filter(
    (block) =>
      block.slug &&
      [
        "avec-qui-puis-je-communiquer",
        "com-animale-une-seance-en-pratique",
        "com-animale-type-de-seance-et-tarifs",
        "com-animale-les-packs",
      ].includes(block.slug)
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
            <BlockRendererClient content={whatIsThisContent.content} />
            <Button
              titleButton="Ma façon de travailler et mon éthique"
              lien="/about/ethics"
              className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
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
            <BlockRendererClient content={whatIsItForContent.content} />
            <Button
              titleButton="Réserver une communication"
              lien="https://form.jotform.com/232924829211052"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
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
          lien="https://form.jotform.com/232924829211052"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default ServicesIndex;
