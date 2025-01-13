"use client";

import { Accordion } from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { StrapiBlockContent } from "../api/types/strapi";
import BlockRendererClient from "../api/strapi/BlockRendererClient";
import { fetchMultipleAccordions } from "../api/strapi/accordion";
import { fetchBlockContentById } from "../api/strapi/block-content";

const AboutIndex: NextPage = () => {
  const [blockContents, setBlockContents] = useState<
    StrapiBlockContent[] | null
  >(null);

  const [accordions, setAccordions] = useState<StrapiBlockContent[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAccordions = await fetchMultipleAccordions([
          "ma-formation-en-communication-animale",
          "ma-formation-en-soins-energetiques",
          "ma-formation-pour-les-services-aux-gardiens",
          "mon-ancienne-vie",
        ]);
        const blockIds = [
          "qcw4qczfv0cdjav8lldwgafd",
          "pjl27su4oxru475tjkhaaywd",
        ];

        const responsesBlockContent = await Promise.all(
          blockIds.map((id) => fetchBlockContentById(id))
        );

        const validBlockContents = responsesBlockContent.filter(
          (content): content is StrapiBlockContent => content !== null
        );

        setBlockContents(validBlockContents);
        setAccordions(responseAccordions);
      } catch (error) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!blockContents) return <p>Chargement des données...</p>;
  if (!accordions) return <p>Chargement des données...</p>;

  const oceaneContent = blockContents.find((block) => block.slug === "oceane");
  const diplomesEtFormations = blockContents.find(
    (block) => block.slug === "mes-diplomes-et-formations"
  );
  const trainingContents = accordions.filter((block) =>
    [
      "ma-formation-en-communication-animale",
      "ma-formation-en-soins-energetiques",
      "ma-formation-pour-les-services-aux-gardiens",
      "mon-ancienne-vie",
    ].includes(block.slug)
  );

  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Qui suis-je ?
      </h2>

      {oceaneContent && (
        <div className="flex justify-center bg-beige">
          <div className="py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={oceaneContent.title}
              image={oceaneContent.picture?.url || ""}
              alt={oceaneContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={oceaneContent.content} />
            <div className="flex justify-center py-8">
              <Image
                className="w-1/2 h-full md:w-1/6 item-center object-cover"
                loading="lazy"
                src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720856658/fox-7405603_1920_etg9z1.png"
                alt=""
                aria-hidden="true"
                width={1920}
                height={1358}
              />
            </div>
            <p>
              <strong>
                Pour en savoir plus, vous pouvez consulter la partie diplômes et
                formations ci-dessous.
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* Bloc secondaire : Formations */}
      {diplomesEtFormations && (
        <div className="flex justify-center bg-dark-beige">
          <div className="py-8 w-full md:w-3/5 px-4">
            <CardTitlePhoto
              title={diplomesEtFormations.title}
              image={diplomesEtFormations.picture?.url || ""}
              alt={diplomesEtFormations.picture?.alternativeText || ""}
            />
            {trainingContents.map((training) => {
              return (
                <Accordion key={training.slug} title={training.title}>
                  <section className="text-justify">
                    <BlockRendererClient content={training.content} />
                  </section>
                </Accordion>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver un service"
          lien="/contact/booking"
          className="flex justify-center items-center mt-8 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default AboutIndex;
