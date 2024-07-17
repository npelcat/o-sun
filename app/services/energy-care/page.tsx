import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import Accordion from "@/src/components/Accordion";

const EnergyCare: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Les soins énergétiques
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5 px-4">
          <CardTitlePhoto
            title="Qu'est-ce que c'est ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402548/IMG_7523_hrovuj.jpg"
          />
          <p className="pt-8">
            <strong>Explication générale du soin énergétique</strong> <br />
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
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402551/IMG_6874_rrkiyv.jpg"
          />
          <p className="pt-8">
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
            titleButton="Réserver un soin énergétique"
            lien="/contact/booking"
          />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402552/IMG_7047_tmezot.jpg"
          />
          <div>
            <Accordion title="A qui s'adresse mes soins énergétiques ?">
              <p>
                Contenu détaillé de à qui s&apos;adresse tes soins énergétiques
                (animaux, autre... ?).
              </p>
            </Accordion>
            <Accordion title="Une séance en pratique">
              <p>
                Contenu détaillé de comment se passe une séance (Combien de
                temps ça te prends, ton approche, les différentes étapes pour
                l&apos;animal et pour toi... Si besoin n&apos;hésite pas à
                renvoyer vers l&apos;onglet éthique et je ferai un lien).
              </p>
            </Accordion>
            <Accordion title="Types de séance et tarifs">
              <p>Les séances possibles (intitulé) et leur tarifs.</p>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button titleButton="Réserver un soin" lien="/contact/booking" />
      </div>
    </div>
  );
};

export default EnergyCare;
