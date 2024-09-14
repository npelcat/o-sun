import Image from "next/image";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { GiFeather } from "react-icons/gi";
import { LiaFeatherAltSolid } from "react-icons/lia";

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
            <p className="pt-8 text-center">
              Les réservations se font par semaine de disponibilité. Ces
              dernières sont régulièrement communiquées en story sur mon compte
              Instagram, et sur les{" "}
              <strong> formulaires de réservation (ci-dessous).</strong>
              <span className="flex justify-center my-4">
                <LiaFeatherAltSolid />
              </span>
              Vous aurez un formulaire à remplir avec toute les informations
              nécessaires au bon déroulement du service choisi à me transmettre.
              En réponse, je vous donnerai mes prochaines disponibilités ainsi
              que le moyen de règlement (RIB).
              <span className="flex justify-center my-4">
                <LiaFeatherAltSolid />
              </span>
              Si toutes les modalités vues ensemble vous conviennent, votre
              place sera alors préréservée pendant 72h, le temps de recevoir
              votre paiement et valider ainsi définitivement la demande de
              prestation.
              <span className="flex justify-center my-4">
                <LiaFeatherAltSolid />
              </span>
              <i>
                Note pour les séances énergétiques : Pour la séance, votre
                animal doit être au calme et au repos. Vous aurez donc un
                rendez-vous plus précis que pour une communication animale (date
                et heure à définir ensemble).
              </i>
            </p>
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
