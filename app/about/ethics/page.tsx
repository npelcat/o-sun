"use client";

import Image from "next/image";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import usePageData from "@/app/api/utils/usePageData";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import Loader from "@/src/components/Loader";

const Ethics: React.FC = () => {
  const blockIds = ["p4rfvz92wvfp1avhdpmnmmgp"];
  const accordionSlugs = [
    "mon-ethique-en-communication-animale",
    "mon-ethique-en-soins-energetiques",
    "mon-ethique-pour-les-services-aux-gardiens",
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

  const wayOfWorking = blockContents.find(
    (block) => block.slug === "ma-facon-de-travailler"
  );

  const ethicsContents = accordions.filter((block) =>
    accordionSlugs.includes(block.slug || "")
  );

  return (
    <div className="pt-16 space-y-12">
      <h2 className="text-center text-3xl font-subtitle font-bold px-4">
        Mon éthique
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="w-full md:w-3/5 py-8 px-4">
          {wayOfWorking && (
            <>
              <CardTitlePhoto
                title={wayOfWorking.title}
                image={wayOfWorking.picture?.url || ""}
                alt={wayOfWorking.picture?.alternativeText || ""}
              />
              <section className="pt-8 text-justify">
                <BlockRendererClient content={wayOfWorking.content} />
                <div className="flex justify-center py-8">
                  <Image
                    className="w-1/2 md:w-1/6 object-cover"
                    loading="lazy"
                    src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720859313/dog-1532627_1920_soflbg.png"
                    alt=""
                    aria-hidden="true"
                    width={1920}
                    height={1180}
                  />
                </div>
              </section>
            </>
          )}

          <div className="bg-dark-beige rounded-lg my-8 p-4">
            <h3 className="text-center font-bold bg-white bg-opacity-50 rounded-lg p-2">
              Les détails de ma pratique pour chaque discipline :
            </h3>
            <div className="text-justify">
              {ethicsContents.map((content) => (
                <Accordion key={content.slug} title={content.title}>
                  <BlockRendererClient content={content.content} />
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-12">
        <Button
          titleButton="Me contacter"
          lien="/contact"
          className="text-xl text-white bg-dark-green font-subtitle rounded-full px-6 py-3 transition hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Ethics;
