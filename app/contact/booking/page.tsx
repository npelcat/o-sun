"use client";

import Image from "next/image";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { GiFeather } from "react-icons/gi";
import GeneralBooking from "@/src/content/booking/general-booking.mdx";

const Booking: React.FC = () => {
  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Réservations
      </h2>
      <div className="flex justify-center bg-beige">
        <div className="py-8 w-full md:w-3/5  px-4">
          <div>
            <CardTitlePhoto
              title="Pour réserver un service"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402547/DSC03712_nveqsy.jpg"
            />
            <GeneralBooking />
            <div className="bg-dark-beige rounded-lg my-8 p-2">
              <h3 className="font-bold mt-8 bg-white bg-opacity-50 rounded-lg p-2">
                Les réservations par services :
              </h3>
              <div className="flex flex-col items-center">
                <Button
                  titleButton="Réserver une communication animale"
                  lien="https://form.jotform.com/232924829211052"
                  target="_blank"
                />
                <GiFeather className="my-4" />
                <Button
                  titleButton="Réserver une séance énergétique"
                  lien="https://form.jotform.com/233515437828361"
                  target="_blank"
                />
                <GiFeather className="my-4" />
                <Button
                  titleButton="Réserver un service pour moi (gardien)"
                  lien="#"
                  target="_blank"
                />
                <p>
                  <i>Service en cours de création</i>
                </p>
                <GiFeather className="my-4" />
                <Button
                  titleButton="Réserver un Pack"
                  lien="https://form.jotform.com/232924829211052"
                  target="_blank"
                />
              </div>
            </div>
            <div className="flex justify-center py-8">
              <Image
                className="w-1/2 h-full md:w-1/6 item-center object-cover"
                loading="lazy"
                src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720961702/animal-2026667_1920_nvpmjw.png"
                alt="chien et chat"
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
        />
      </div>
    </div>
  );
};

export default Booking;
