"use client";

import { Button } from "@/src/components/Button";
import { NextPage } from "next";
import Accordion from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import Link from "next/link";
import WhatIsAnimalCom from "@/src/content/services/animal-com/what-is-animal-com.mdx";
import ForWhat from "@/src/content/services/animal-com/for-what.mdx";
import dynamic from "next/dynamic";

const WithWho = dynamic(
  () => import("@/src/content/services/animal-com/with-who.mdx")
);
const PracticalSession = dynamic(
  () => import("@/src/content/services/animal-com/practical-session.mdx")
);
const TypeAndPrices = dynamic(
  () => import("@/src/content/services/animal-com/type-and-prices.mdx")
);
const Packs = dynamic(
  () => import("@/src/content/services/animal-com/packs.mdx")
);

const ServicesIndex: NextPage = () => {
  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        La communication animale
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5 px-4">
          <CardTitlePhoto
            title="Qu'est-ce que c'est ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402554/IMG_6702_f4snyr.jpg"
          />
          <WhatIsAnimalCom />
          <Button
            titleButton="Ma façon de travailler et mon éthique"
            lien="/about/ethics"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="A quoi ça sert ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402549/DSC03447_qlifqp.jpg"
          />
          <ForWhat />
          <Button
            titleButton="Réserver une communication"
            lien="https://form.jotform.com/232924829211052"
            target="_blank"
          />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402553/IMG_7041_u1eddf.jpg"
          />
          <div>
            <Accordion title="Avec qui puis-je communiquer ?">
              <section className="text-justify">
                <WithWho />
              </section>
            </Accordion>
            <Accordion title="Une séance en pratique">
              <section className="text-justify">
                <PracticalSession />
              </section>
            </Accordion>
            <Accordion title="Types de séance et tarifs">
              <section className="text-justify">
                <TypeAndPrices />
                <h5 className="mt-8">
                  POUR TOUTE URGENCE, ME CONTACTER DIRECTEMENT VIA LE
                  <Link
                    href="/contact"
                    className="bg-dark-green bg-opacity-30 rounded-lg hover:text-dark-green hover:bg-beige hover:drop-shadow-lg"
                  >
                    {" "}
                    FORMULAIRE DU SITE.
                  </Link>
                </h5>
              </section>
            </Accordion>
            <Accordion title="Les PACKS">
              <section className="text-justify">
                <Packs />
              </section>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver une communication"
          lien="https://form.jotform.com/232924829211052"
          target="_blank"
        />
      </div>
    </div>
  );
};

export default ServicesIndex;
