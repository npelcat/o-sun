"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { useEffect, useState } from "react";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import { fetchBlockContentAndAccordions } from "@/app/api/utils/fetchPage";
import BlockRendererClient from "@/app/api/strapi/BlockRendererClient";

const Guardians: React.FC = () => {
  const [data, setData] = useState<{
    blockContents: StrapiBlockContent[] | null;
    accordions: StrapiBlockContent[] | null;
  }>({
    blockContents: null,
    accordions: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockIds = [
          "e6kkmhe424iko1zevz8wo51z",
          "g5lgt0mnb1dxj57jt74pg1fd",
          "kc8jct496l1snx0r4vttadjn",
        ];
        const accordionSlugs = [
          "en-pratique-premier-service",
          "en-pratique-deuxieme-service",
          "gardiens-type-de-seance-et-tarifs",
        ];

        const { blockContents, accordions } =
          await fetchBlockContentAndAccordions(blockIds, accordionSlugs);
        setData({ blockContents, accordions });
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data.blockContents || !data.accordions)
    return <p>Chargement des données...</p>;

  const whatAreTheyContent = data.blockContents.find(
    (block) => block.slug === "gardiens-quels-sont-ils"
  );
  const whatIsItForContent = data.blockContents.find(
    (block) => block.slug === "gardiens-a-quoi-ca-sert"
  );
  const practicalInfosContent = data.blockContents.find(
    (block) => block.slug === "gardiens-infos-pratiques"
  );

  const practicalInfosAccordions = data.accordions.filter((block) =>
    [
      "en-pratique-premier-service",
      "en-pratique-deuxieme-service",
      "gardiens-type-de-seance-et-tarifs",
    ].includes(block.slug)
  );

  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Services aux gardiens
      </h2>

      {whatAreTheyContent && (
        <div className="flex justify-center bg-beige">
          <div className=" py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={whatAreTheyContent.title}
              image={whatAreTheyContent.picture?.url || ""}
              alt={whatAreTheyContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={whatAreTheyContent.content} />
            <Button
              titleButton="Ma façon de travailler et mon éthique"
              lien="/about/ethics"
              className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
            />
          </div>
        </div>
      )}

      {whatIsItForContent && (
        <div className="flex justify-center bg-beige">
          <div className=" py-8 w-full md:w-3/5  px-4">
            <CardTitlePhoto
              title={whatIsItForContent.title}
              image={whatIsItForContent.picture?.url || ""}
              alt={whatIsItForContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={whatIsItForContent.content} />
            <Button
              titleButton="Services en cours de création"
              lien="/contact/booking"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
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
          titleButton="Services en cours de création"
          lien="/contact/booking"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center m-8 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Guardians;
