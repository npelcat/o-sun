import { Button } from "@/src/components/Button";
import { NextPage } from "next";
import Accordion from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";

const ServicesIndex: NextPage = () => {
  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        La communication animale
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5 px-4">
          <CardTitlePhoto
            title="Qu'est-ce que c'est ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402554/IMG_6702_f4snyr.jpg"
          />
          <p className="pt-8">
            <strong>Explication générale de la communication animale</strong>{" "}
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
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402549/DSC03447_qlifqp.jpg"
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
            titleButton="Réserver une communication"
            lien="/contact/booking"
          />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402553/IMG_7041_u1eddf.jpg"
          />
          <div>
            <Accordion
              title="Avec qui puis-je communiquer ?"
              content="Contenu détaillé de à qui s'adresse la communication animale (animaux de compagnie, espèces, animaux sauvages, animaux défunts...)."
            />
            <Accordion
              title="Une séance en pratique"
              content="Contenu détaillé de comment se passe une séance (Combien de temps ça te prends, ton approche de l'animal, les différentes étapes pour l'animal et pour toi... Si besoin n'hésite pas à renvoyer vers l'onglet 'éthique' et je ferai un lien)."
            />
            <Accordion
              title="Types de séance et tarifs"
              content="Les séances possibles (intitulé) et leur tarifs."
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver une communication"
          lien="/contact/booking"
        />
      </div>
    </div>
  );
};

export default ServicesIndex;
