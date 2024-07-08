import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";

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
              title="Pongo et sa gardienne Anita"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719393651/cld-sample.jpg"
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
            <h3 className="font-bold">Anita</h3>
            <p className="italic">Le 8 Juillet 2024</p>
          </div>
          <div>
            <CardTitlePhoto
              title="Pour une guidance : Léa"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719393641/samples/two-ladies.jpg"
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
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
