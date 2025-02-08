"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import usePageData from "@/app/api/utils/usePageData";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import Loader from "@/src/components/Loader";

const EnergyCare: React.FC = () => {
  const blockIds = [
    "etf6ka1c7dqjxms8h2httkls",
    "krjgfou8hwz6gr9673mgs56i",
    "h5gdzy76slippixboqv6t540",
    "bulx7c6i548oqn4t2ervuu04",
  ];
  const accordionSlugs = [
    "a-qui-s-adresse-mes-soins-energetiques",
    "soins-energetiques-une-seance-en-pratique",
    "soins-energetiques-type-de-seance-et-tarifs",
  ];

  const { blockContents, accordions, error } = usePageData(
    blockIds,
    accordionSlugs
  );

  if (error)
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  if (!blockContents || !accordions) return <Loader />;

  const whatIsThisContent = blockContents.find(
    (block) => block.slug === "soins-energetiques-qu-est-ce-que-c-est"
  );
  const whatEffectsContent = blockContents.find(
    (block) => block.slug === "quels-sont-les-effets-d-une-seance-energetique"
  );
  const onWhatContent = blockContents.find(
    (block) => block.slug === "sur-quoi-agit-une-seance-energetique"
  );
  const practicalInfosContent = blockContents.find(
    (block) => block.slug === "soins-energetiques-infos-pratiques"
  );

  const practicalInfosAccordions = accordions.filter(
    (block) =>
      block.slug &&
      [
        "a-qui-s-adresse-mes-soins-energetiques",
        "soins-energetiques-une-seance-en-pratique",
        "soins-energetiques-type-de-seance-et-tarifs",
      ].includes(block.slug)
  );

  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Les soins énergétiques
      </h2>

      {whatIsThisContent && (
        <div className="flex justify-center bg-beige">
          <div className=" py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={whatIsThisContent.title}
              image={whatIsThisContent.picture?.url || ""}
              alt={whatIsThisContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={whatIsThisContent.content} />
            <Button
              titleButton="Ma façon de travailler et mon éthique"
              lien="/about/ethics"
              className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
            />
          </div>
        </div>
      )}

      {whatEffectsContent && (
        <div className="flex justify-center bg-beige">
          <div className=" py-8 w-full md:w-3/5  px-4">
            <CardTitlePhoto
              title={whatEffectsContent.title}
              image={whatEffectsContent.picture?.url || ""}
              alt={whatEffectsContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={whatEffectsContent.content} />
            <Button
              titleButton="Réserver un soin énergétique"
              lien="https://calendly.com/o-sun-voixanimale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
            />
          </div>
        </div>
      )}

      {onWhatContent && (
        <div className="flex justify-center bg-beige">
          <div className="text-justify py-8 w-full md:w-3/5  px-4">
            <CardTitlePhoto
              title={onWhatContent.title}
              image={onWhatContent.picture?.url || ""}
              alt={onWhatContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={onWhatContent.content} />
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
          titleButton="Réserver un soin énergétique"
          lien="https://form.jotform.com/233515437828361"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default EnergyCare;
