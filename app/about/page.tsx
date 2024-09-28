"use client";
import Accordion from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { NextPage } from "next";
import Image from "next/image";
import MyJourney from "@/src/content/who-am-i/my-journey.mdx";
import dynamic from "next/dynamic";

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
  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Qui suis-je ?
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="py-8 w-full md:w-3/5  px-4">
          <div>
            <CardTitlePhoto
              title="Océane, (définition de toi en 3, 4 mots)"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402550/IMG_6825_tdlhcg.jpg"
            />
            <MyJourney />
            <div className="flex justify-center py-8">
              <Image
                className="w-1/2 h-full md:w-1/6 item-center object-cover"
                loading="lazy"
                src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720856658/fox-7405603_1920_etg9z1.png"
                alt="renard qui dort"
                width="1920"
                height="1358"
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
      </div>
      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Mes diplômes et formations"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402552/IMG_7198_r1dwqk.jpg"
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
        <Button titleButton="Réserver un service" lien="/contact/booking" />
      </div>
    </div>
  );
};

export default AboutIndex;
