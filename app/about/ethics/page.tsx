"use client";

import Image from "next/image";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import MyWayOfWorking from "@/src/content/my-ethics/way-of-working.mdx";
import dynamic from "next/dynamic";

const EthicAnimalCom = dynamic(
  () => import("@/src/content/my-ethics/ethic-animal-com.mdx")
);

const EthicEnergyCare = dynamic(
  () => import("@/src/content/my-ethics/ethic-energy-care.mdx")
);

const EthicGuardians = dynamic(
  () => import("@/src/content/my-ethics/ethic-guardians.mdx")
);

const Ethics: React.FC = () => {
  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Mon éthique
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="py-8 w-full md:w-3/5  px-4">
          <div>
            <CardTitlePhoto
              title="Ma façon de travailler"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402550/IMG_7142_oybyym.jpg"
              alt="Océane et son cheval Ghost"
            />
            <section className="pt-8 text-justify">
              <MyWayOfWorking />
              <div className="flex justify-center py-8">
                <Image
                  className="w-1/2 h-full md:w-1/6 item-center object-cover"
                  loading="lazy"
                  src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720859313/dog-1532627_1920_soflbg.png"
                  alt=""
                  aria-hidden="true"
                  width="1920"
                  height="1180"
                />
              </div>
            </section>
            <div className="bg-dark-beige rounded-lg my-8 p-2">
              <h3 className="font-bold mt-8 bg-white bg-opacity-50 rounded-lg p-2">
                Les détails de ma pratique pour chaque discipline :
              </h3>
              <div className="p-2">
                <div>
                  <Accordion title="Communication Animale">
                    <EthicAnimalCom />
                  </Accordion>
                  <Accordion title="Soins énergétiques">
                    <EthicEnergyCare />
                  </Accordion>
                  <Accordion title="Pour les gardiens">
                    <EthicGuardians />
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <Button
          titleButton="Me contacter"
          lien="/contact"
          className="flex justify-center items-center mt-8 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Ethics;
