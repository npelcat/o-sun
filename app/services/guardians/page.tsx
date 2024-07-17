import Link from "next/link";
import Image from "next/image";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import Accordion from "@/src/components/Accordion";

const Guardians: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Services aux gardiens
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5 px-4">
          <CardTitlePhoto
            title="Quels sont-ils ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720967009/tarot-8643585_1920_wjzdf2.png"
          />
          <p className="pt-8">
            <strong>
              Explication générale des services aux humains que tu proposes,
              organisés en bullet points ou autre, selon tes souhaits. (Les
              photos de cette page seront à remplacer par les tiennes :) )
            </strong>{" "}
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin
            porttitor, orci nec nonummy molestie, enim est eleifend mi, non
            fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa,
            scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum
            bibendum augue.
          </p>
          <Button
            titleButton="Ma façon de travailler et mon éthique"
            lien="/about/ethics"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="A quoi ça sert ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720966614/tarot-5070107_1920_edpr5n.jpg"
          />
          <p className="pt-8">
            <strong>
              Explications sur quel service pour quelle demande ou quel besoin
              (possibilité de faire plusieurs paragraphes bien différenciés
              selon tes souhaits !)
            </strong>{" "}
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin
            porttitor, orci nec nonummy molestie, enim est eleifend mi, non
            fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa,
            scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum
            bibendum augue.
          </p>
          <Button titleButton="Réserver un service" lien="/contact/booking" />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720966610/tarot-8834477_1920_xgbuyu.jpg"
          />
          <div>
            <Accordion title="Une séance en pratique">
              <p>
                Contenu détaillé de comment se passe une séance (Combien de
                temps ça te prends, ton approche, les différentes étapes pour le
                ou la gardien.ne et pour toi... Si besoin n&apos;hésite pas à
                renvoyer vers l&apos;onglet éthique et je ferai un lien).
              </p>
            </Accordion>
            <Accordion title="Types de séance et tarifs">
              Les séances possibles (intitulé) et leur tarifs.
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

export default Guardians;
