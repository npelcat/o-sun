import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import Image from "next/image";

const Testimonials: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Témoignages
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-20 py-8 w-full md:w-4/5 px-4">
          <div>
            <CardTitlePhoto
              title="Sleigh & son gardien Bob"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719393615/samples/animals/reindeer.jpg"
              alt="Un renne"
            />
            <p className="pt-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
              risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
              nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
              ligula massa, varius a, semper congue, euismod non, mi. Proin
              porttitor, orci nec nonummy molestie, enim est eleifend mi, non
              fermentum diam nisl sit amet erat.
            </p>
            <br />
            <h3 className="font-bold">Bob</h3>
            <p className="italic">Le 8 Juillet 2024</p>
          </div>
          <div>
            <CardTitlePhoto
              title="Zarella et sa gardienne Maude"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719393617/samples/sheep.jpg"
              alt="Plusieurs moutons sur la route"
            />
            <p className="pt-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
              risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
              nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
              ligula massa, varius a, semper congue, euismod non, mi. Proin
              porttitor, orci nec nonummy molestie, enim est eleifend mi, non
              fermentum diam nisl sit amet erat.
            </p>
            <br />
            <h3 className="font-bold">Maude</h3>
            <p className="italic">Le 8 Juillet 2024</p>
          </div>
          <div>
            <CardTitlePhoto
              title="Cament et son gardien Mehdi"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719393620/samples/animals/three-dogs.jpg"
              alt="Un chien blanc de race boxer"
            />
            <p className="pt-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
              risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
              nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
              ligula massa, varius a, semper congue, euismod non, mi. Proin
              porttitor, orci nec nonummy molestie, enim est eleifend mi, non
              fermentum diam nisl sit amet erat.
            </p>
            <br />
            <h3 className="font-bold">Mehdi</h3>
            <p className="italic">Le 8 Juillet 2024</p>
          </div>
          <div>
            <CardTitlePhoto
              title="Mauve et son gardien Guy"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719393614/samples/animals/cat.jpg"
              alt="Jeune chat gris aux yeux verts dans son panier"
            />
            <p className="pt-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
              risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
              nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
              ligula massa, varius a, semper congue, euismod non, mi. Proin
              porttitor, orci nec nonummy molestie, enim est eleifend mi, non
              fermentum diam nisl sit amet erat.
            </p>
            <br />
            <h3 className="font-bold">Guy</h3>
            <p className="italic">Le 8 Juillet 2024</p>
          </div>
          <div>
            <CardTitlePhoto
              title="Pour une guidance : Léa"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719393641/samples/two-ladies.jpg"
              alt="Deux jeunes femmes qui rient"
            />
            <p className="pt-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
              risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
              nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
              ligula massa, varius a, semper congue, euismod non, mi. Proin
              porttitor, orci nec nonummy molestie, enim est eleifend mi, non
              fermentum diam nisl sit amet erat.
            </p>
            <br />
            <h3 className="font-bold">Léa</h3>
            <p className="italic">Le 8 Juillet 2024</p>
          </div>
          <div className="flex flex-col justify-end">
            <Image
              className="w-full h-auto object-cover"
              loading="lazy"
              src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1731764404/rabbit-161467_1280_ckpw3f.png"
              alt=""
              aria-hidden="true"
              width="1029"
              height="1280"
            />
            <p className="pt-8">
              <strong>Consulter les autres avis :</strong>
            </p>
            <Button
              titleButton="Avis Google"
              lien="https://www.google.com/search?client=firefox-b-d&sca_esv=f3abb217fb528311&sxsrf=ADLYWIL_GQ_PC-IenD17enp6_LVkAxUdEA:1731763003006&q=o%27sun+voix+animale&si=ACC90nwjPmqJHrCEt6ewASzksVFQDX8zco_7MgBaIawvaF4-7gukCCCj3HMoXA8EhI8OXZDsb6HENkobNzSbN1iXphPgepPIv_ydvun7HyEulUOwR4oEiaU%3D&uds=ADvngMhGB-VtBMom1-3tEuR0_dZAqVXLkLNFD5Nb5yTKtEOzLWPm2J32gwBTnDq-KRza4BlHr-byDgYwWU7D840Iu8uOkJ4QB5QBcewQn4J6D5wdEPUBPOs&sa=X&ved=2ahUKEwiphYT19-CJAxXOUqQEHS4FGcIQ3PALegQIFxAE&biw=1536&bih=730&dpr=1.25"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center mt-8 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
            />
            <br />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver un service"
          lien="/contact/booking"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center mt-8 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Testimonials;
