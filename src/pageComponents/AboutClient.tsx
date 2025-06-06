"use client";

import { Accordion } from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import Image from "next/image";
import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

interface AboutClientProps {
  blockContents: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

export default function AboutClient({
  blockContents,
  accordions,
}: AboutClientProps) {
  const oceaneContent = blockContents.find((b) => b.slug === "oceane");
  const diplomesEtFormations = blockContents.find(
    (b) => b.slug === "mes-diplomes-et-formations"
  );

  const trainingContents = accordions.filter((b) =>
    [
      "ma-formation-en-communication-animale",
      "ma-formation-en-soins-energetiques",
      "ma-formation-pour-les-services-aux-gardiens",
      "mon-ancienne-vie",
    ].includes(b.slug || "")
  );

  return (
    <div className="pt-16 space-y-12 text-center">
      <h2 className="text-3xl font-bold font-subtitle px-4 pt-16 pb-5">
        Qui suis-je ?
      </h2>

      {oceaneContent && (
        <section className="flex justify-center bg-beige">
          <div className="w-full md:w-3/5 py-8 px-4 space-y-8 text-justify">
            <CardTitlePhoto
              title={oceaneContent.title}
              image={oceaneContent.picture?.url || ""}
              alt={oceaneContent.picture?.alternativeText || ""}
            />
            <BlockRendererClient content={oceaneContent.content} />
            <div className="flex justify-center py-8">
              <Image
                src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720856658/fox-7405603_1920_etg9z1.png"
                alt=""
                aria-hidden="true"
                width={1920}
                height={1358}
                loading="lazy"
                className="object-cover w-1/2 md:w-1/6"
              />
            </div>
            <p className="font-semibold text-center">
              Pour en savoir plus, vous pouvez consulter la partie diplômes et
              formations ci-dessous.
            </p>
          </div>
        </section>
      )}

      {diplomesEtFormations && (
        <section className="flex justify-center bg-dark-beige">
          <div className="w-full md:w-3/5 py-8 px-4 space-y-8 text-justify">
            <CardTitlePhoto
              title={diplomesEtFormations.title}
              image={diplomesEtFormations.picture?.url || ""}
              alt={diplomesEtFormations.picture?.alternativeText || ""}
            />
            {trainingContents.map((training) => (
              <Accordion key={training.slug} title={training.title}>
                <section className="text-justify">
                  <BlockRendererClient content={training.content} />
                </section>
              </Accordion>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-center mt-16">
        <Button titleButton="Réserver un service" link="/contact/booking" />
      </div>
    </div>
  );
}
