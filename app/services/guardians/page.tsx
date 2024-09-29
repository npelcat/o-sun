"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import Accordion from "@/src/components/Accordion";
import { IoIosArrowDropright } from "react-icons/io";
import WhatServices from "@/src/content/services/guardians/what-services.mdx";
import ForWhat from "@/src/content/services/guardians/for-what.mdx";
import dynamic from "next/dynamic";

const PracticalSession = dynamic(
  () => import("@/src/content/services/guardians/practical-session.mdx")
);
const TypeAndPrices = dynamic(
  () => import("@/src/content/services/guardians/type-and-prices.mdx")
);

const Guardians: React.FC = () => {
  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Services aux gardiens
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5 px-4">
          <CardTitlePhoto
            title="Quels sont-ils ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720967009/tarot-8643585_1920_wjzdf2.png"
          />
          <WhatServices />
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
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720966614/tarot-5070107_1920_edpr5n.jpg"
          />
          <ForWhat />
          <Button
            titleButton="Services en cours de création"
            lien="/contact/booking"
          />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720966610/tarot-8834477_1920_xgbuyu.jpg"
          />
          <div>
            <Accordion title="Une séance en pratique">
              <section className="text-justify">
                <PracticalSession />
              </section>
            </Accordion>
            <Accordion title="Types de séance et tarifs">
              <section className="text-justify">
                <TypeAndPrices />
              </section>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Services en cours de création"
          lien="/contact/booking"
        />
      </div>
    </div>
  );
};

export default Guardians;
