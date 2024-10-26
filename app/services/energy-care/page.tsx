"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import Accordion from "@/src/components/Accordion";
import Link from "next/link";
import WhatIsEnergyCare from "@/src/content/services/energy-care/what-is-energy-care.mdx";
import WhatEffects from "@/src/content/services/energy-care/what-effects.mdx";
import ActOnWhat from "@/src/content/services/energy-care/act-on-what.mdx";
import dynamic from "next/dynamic";

const ForWho = dynamic(
  () => import("@/src/content/services/energy-care/for-who.mdx")
);
const PracticalSession = dynamic(
  () => import("@/src/content/services/energy-care/practical-session.mdx")
);
const TypeAndPrices = dynamic(
  () => import("@/src/content/services/energy-care/type-and-prices.mdx")
);

const EnergyCare: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Les soins énergétiques
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5 px-4">
          <CardTitlePhoto
            title="Qu'est-ce que c'est ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402548/IMG_7523_hrovuj.jpg"
            alt="Océane et son cheval gris Ghost, les mains posées autour de son encolure"
          />
          <WhatIsEnergyCare />
          <Button
            titleButton="Ma façon de travailler et mon éthique"
            lien="/about/ethics"
            className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Quels sont les effets d'une séance énergétique ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402551/IMG_6874_rrkiyv.jpg"
            alt="Océane et un de ses bergers australien en face à face, la tête penchée"
          />
          <WhatEffects />
          <Button
            titleButton="Réserver un soin énergétique"
            lien="https://form.jotform.com/233515437828361"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Sur quoi agit une séance énergétique ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402554/IMG_7583_ky7o2f.jpg"
            alt="Océane et son cheval gris Ghost, avec un coucher de soleil derrière eux"
          />
          <ActOnWhat />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402552/IMG_7047_tmezot.jpg"
            alt="Tête d'un berger australien tricolore"
          />
          <div>
            <Accordion title="A qui s'adresse mes soins énergétiques ?">
              <section className="text-justify">
                <ForWho />
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
                    aria-label="Accéder au formulaire de contact"
                  >
                    {" "}
                    FORMULAIRE DU SITE.
                  </Link>
                </h5>
              </section>
            </Accordion>
          </div>
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
