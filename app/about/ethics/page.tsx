import Image from "next/image";
import { Button } from "@/src/components/Button";
import Accordion from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";

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
            />
            <p className="pt-8">
              Ta façon de travailler en quelques lignes, de façon général :
              <br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed non risus. Suspendisse lectus tortor, dignissim sit amet,
              adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
              diam. Maecenas ligula massa, varius a, semper congue, euismod non,
              mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend
              mi, non fermentum diam nisl sit amet erat.
            </p>
            <div className="bg-dark-beige rounded-lg my-8 p-2">
              <h3 className="font-bold mt-8 bg-white bg-opacity-50 rounded-lg p-2">
                Les détails de ma pratique pour chaque discipline :
              </h3>
              <div className="p-2">
                <div>
                  <Accordion title="Communication Animale">
                    <p>
                      Ton éthique pour la com animale, ta façon de faire, ce que
                      tu fais et ce que tu ne fais pas... (exemple: animaux
                      perdus, guérison, etc)
                    </p>
                  </Accordion>
                  <Accordion title="Soins énergétiques">
                    <p>
                      Ton éthique pour les soins énergétiques, ta façon de
                      faire, ce que ça permet de faire et ce que ça ne fait
                      pas...
                    </p>
                  </Accordion>
                  <Accordion title="Pour les gardiens">
                    <p>
                      Ton éthique pour les guidances, oracles et autres
                      services, ta façon de faire, ce que ça permet ou non...
                    </p>
                  </Accordion>
                </div>
              </div>
            </div>
            <div className="flex justify-center py-8">
              <Image
                className="w-1/2 h-full md:w-1/6 item-center object-cover"
                loading="lazy"
                src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720859313/dog-1532627_1920_soflbg.png"
                alt="chien et chat"
                width="1920"
                height="1180"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <Button titleButton="Me contacter" lien="/contact" />
      </div>
    </div>
  );
};

export default Ethics;
