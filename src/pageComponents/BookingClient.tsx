"use client";

import Image from "next/image";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import BlockRendererClient from "@/app/api/utilsStrapi/BlockRendererClient";

interface BookingClientProps {
  blockContent: StrapiBlockContent;
}

export default function BookingClient({ blockContent }: BookingClientProps) {
  const bookingOptions = [
    {
      title: "💌 Réserver une communication animale",
      lien: "https://calendly.com/o-sun-voixanimale",
    },
    {
      title: "✨ Réserver un soin énergétique animal, humain ou duo",
      lien: "https://form.jotform.com/252464023594356",
    },
    {
      title: "🌙 Réserver une Moon Guidance",
      lien: "https://calendly.com/o-sun-voixanimale/moon-guidance?back=1&month=2025-02",
      note: "(pour les gardiens)",
    },
    {
      title: "📞 Réserver un appel découverte de 15 minutes",
      lien: "https://calendly.com/o-sun-voixanimale/on-s-appelle?back=1&month=2025-05",
      note: "(Pour en savoir plus avant réservation d'un service)",
    },
    {
      title: "🚨 Urgence communication animale",
      lien: "https://form.jotform.com/232924829211052",
    },
  ];

  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Réservations
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="py-8 w-full md:w-3/5 px-4">
          <div>
            <CardTitlePhoto
              title={blockContent.title}
              image={blockContent.picture?.url || ""}
              alt={blockContent.picture?.alternativeText || ""}
            />
            <div className="text-justify">
              <BlockRendererClient content={blockContent.content} />
            </div>

            <div className="bg-white rounded-lg p-2 my-8">
              <h3 className="font-bold py-4 px-2 bg-white bg-opacity-50 rounded-lg">
                Les réservations par services :
              </h3>
              <div className="flex flex-col justify-center items-center gap-2">
                {bookingOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 pt-6 item-center text-center"
                  >
                    <Button
                      titleButton={option.title}
                      link={option.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:border-2 hover:border-beige hover:shadow-xs"
                    />
                    {option.note && (
                      <p className="max-w-xs">
                        <i>{option.note}</i>
                      </p>
                    )}
                    <br />
                    <span aria-hidden="true">🍃</span>
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
                width="300"
                height="400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <Button
          titleButton="Une question ? > Me contacter"
          link="/contact"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  );
}
