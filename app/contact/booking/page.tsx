"use client";

import Image from "next/image";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { useEffect, useState } from "react";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import Loader from "@/src/components/Loader";
import ErrorDisplay from "@/src/components/ErrorDisplay";

const Booking: React.FC = () => {
  const [blockContent, setBlockContent] = useState<StrapiBlockContent | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const blockId = "dwml9tiykiv5r7yjtglsef1x";

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const content = await fetchBlockContentById(blockId);
        setBlockContent(content);
        setError(null);
      } catch (error) {
        console.error("Error fetching content:", error);
        setError("Erreur lors du chargement des informations de réservation.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );

  const bookingOptions = [
    {
      title: "Réserver une communication animale",
      lien: "https://calendly.com/o-sun-voixanimale",
    },
    {
      title: "Réserver un séance énergétique animal",
      lien: "https://calendly.com/o-sun-voixanimale/seance-energetique-ani?back=1&month=2025-05",
    },
    {
      title:
        "Réserver le Pack animal : communication animale + séance énergétique",
      lien: "https://calendly.com/o-sun-voixanimale/pack-profondeur?back=1&month=2025-05",
    },
    {
      title: "Réserver une séance énergétique humain - Appel",
      lien: "https://calendly.com/o-sun-voixanimale/seance-energetique-humain?back=1&month=2025-05",
    },
    {
      title: "Réserver une séance énergétique DUO gardien/animal - Appel",
      lien: "https://calendly.com/o-sun-voixanimale/seance-energetique-duo-appel?back=1&month=2025-05",
    },
    {
      title: "Réserver une Moon Guidance",
      lien: "https://calendly.com/o-sun-voixanimale/moon-guidance?back=1&month=2025-02",
      note: "(pour les gardiens)",
    },
    {
      title: "Réserver un appel découverte de 15 minutes",
      lien: "https://calendly.com/o-sun-voixanimale/on-s-appelle?back=1&month=2025-05",
      note: "(Pour en savoir plus avant réservation d'un service)",
    },
  ];

  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Réservations
      </h2>
      <div className="flex justify-center bg-beige">
        <div className="py-8 w-full md:w-3/5  px-4">
          <div>
            {blockContent && (
              <>
                <CardTitlePhoto
                  title={blockContent.title}
                  image={blockContent.picture?.url || ""}
                  alt={blockContent.picture?.alternativeText || ""}
                />
                <div className="text-justify">
                  <BlockRendererClient content={blockContent.content} />
                </div>
              </>
            )}
            <div className="bg-dark-beige rounded-lg my-8 p-2">
              <h3 className="font-bold mt-8 bg-white bg-opacity-50 rounded-lg p-2">
                Les réservations par services :
              </h3>
              <div className="flex flex-col items-center">
                {bookingOptions.map((option, index) => (
                  <div key={index} className="text-center">
                    <Button
                      titleButton={option.title}
                      lien={option.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center m-4 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-beige hover:text-black"
                    />
                    {option.note && (
                      <p>
                        <i>{option.note}</i>
                      </p>
                    )}
                    🪶
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center py-8">
              <Image
                className="w-1/2 h-full md:w-1/6 item-center object-cover"
                loading="lazy"
                src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720961702/animal-2026667_1920_nvpmjw.png"
                alt=""
                aria-hidden="true"
                width="1920"
                height="1686"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <Button
          titleButton="Une question ? > Me contacter"
          lien="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center m-4 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Booking;
