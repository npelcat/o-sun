import Image from "next/image";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import Accordion from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";

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
            <p className="pt-8">
              <strong>
                Préciser les modalités générales de réservations : exemple : en
                cliquant sur les liens des différents services, vous aurez accés
                à un calendrier... Etc.
              </strong>
              <br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed non risus. Suspendisse lectus tortor, dignissim sit amet,
              adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
              diam. Maecenas ligula massa, varius a, semper congue, euismod non,
              mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend
              mi, non fermentum diam nisl sit amet erat.
            </p>
            <div className="bg-dark-beige rounded-lg my-8 p-2">
              <h3 className="font-bold mt-8 bg-white bg-opacity-50 rounded-lg p-2">
                Les réservations par services :
              </h3>
              <div className="p-2">
                <div>
                  <Accordion
                    title="Communication Animale"
                    button={
                      <Button
                        titleButton="Réserver ce service"
                        lien="https://form.jotform.com/232924829211052"
                      />
                    }
                  >
                    <p>
                      Modalités spécifiques à la com. Exemples : les précisions
                      à apporter, les questions éventuelles pour l&apos;animal,
                      les photos, etc...)
                    </p>
                  </Accordion>
                  <Accordion
                    title="Soins énergétiques"
                    button={
                      <Button
                        titleButton="Réserver ce service"
                        lien="https://form.jotform.com/233515437828361"
                      />
                    }
                  >
                    <p>
                      Modalités spécifiques aux soins énergétiques. Exemples :
                      pour quel animal, pour quel motif, les photos, etc...
                    </p>
                  </Accordion>
                  <Accordion
                    title="Pour les gardiens"
                    button={
                      <Button
                        titleButton="Service en cours de création"
                        lien="#"
                      />
                    }
                  >
                    <p>
                      Modalités spécifiques aux services pour les gardiens.
                      Exemples : type de tirage souhaité, avec quel type
                      d&apos;oracle, la ou les questions, etc...
                    </p>
                  </Accordion>
                </div>
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
        <Button titleButton="Une question ? > Me contacter" lien="/contact" />
      </div>
    </div>
  );
};

export default Booking;
