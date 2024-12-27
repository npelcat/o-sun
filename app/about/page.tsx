"use client";

import { Accordion } from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { GetStaticProps, GetStaticPaths, NextPage, Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import {
  fetchBlockContentById,
  fetchMultipleBlockContents,
} from "../api/strapi/block-content";
import { StrapiBlockContent } from "../api/types/strapi";

const AnimalComTraining = dynamic(
  () => import("@/src/content/who-am-i/animal-com-training.mdx")
);

const EnergyCareTraining = dynamic(
  () => import("@/src/content/who-am-i/energy-care-training.mdx")
);

const OtherServices = dynamic(
  () => import("@/src/content/who-am-i/other-services.mdx")
);

const OldLife = dynamic(() => import("@/src/content/who-am-i/old-life.mdx"));

const AboutIndex: NextPage = () => {
  const [blockContent, setBlockContent] = useState<StrapiBlockContent | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBlockContentById(
          "qjx43r8hwb3pd5h9ca3kvq9f"
        );
        console.log("Réponse de l'API:", response);
        setBlockContent(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!blockContent) return <p>Chargement des données...</p>;

  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Qui suis-je ?
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="py-8 w-full md:w-3/5  px-4">
          <div>
            <div key={blockContent.documentId}>
              <CardTitlePhoto
                title={blockContent.title}
                image={blockContent.picture?.url || ""}
                alt={blockContent.picture?.alternativeText || ""}
              />
              <Markdown>{blockContent.content}</Markdown>
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
            </div>
            <p>
              <strong>
                Pour en savoir plus, vous pouvez consulter la partie diplômes et
                formations ci-dessous.
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Mes diplômes et formations"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402552/IMG_7198_r1dwqk.jpg"
            alt="Océane et son cheval gris Ghost, dans la forêt"
          />
          <div>
            <Accordion title="Ma formation en communication Animale">
              <section className="text-justify">
                <AnimalComTraining />
              </section>
            </Accordion>
            <Accordion title="Ma formation en soins énergétiques">
              <section className="text-justify">
                <EnergyCareTraining />
              </section>
            </Accordion>
            <Accordion title="Ma formation pour les autres services">
              <section className="text-justify">
                <OtherServices />
              </section>
            </Accordion>
            <Accordion title="Mon ancienne vie">
              <section className="text-justify">
                <OldLife />
              </section>
            </Accordion>
          </div>
        </div>
      </div>
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
