import { Button } from "@/src/components/Button";
import { FeatureCard } from "../src/components/FeatureCard";
import { HomeCTA } from "../src/components/HomeCTA";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section>
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-16">
          <HomeCTA
            titleButton="Qui suis-je ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402553/IMG_7558_ylvtta.jpg"
            lien="/about"
          />
          <HomeCTA
            titleButton="Mon éthique"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402555/IMG_1522_oad6fy.jpg"
            lien="/about/ethics"
          />
          <HomeCTA
            titleButton="Réservation"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402553/IMG_67278_cxplew.jpg"
            lien="/contact/booking"
          />
        </div>
      </section>

      <section className="text-center mt-4">
        <h2 className="text-3xl pt-16 pb-5 font-subtitle font-bold">
          Mes Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <FeatureCard
            title="La communication animale"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
            fugiat sit. Optio amet mollitia iusto!"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402554/IMG_7056_n0wsq0.jpg"
            alt="Tête de berger Australien tricolore, penchée sur le côté, regard intéressé"
            lien="/services"
            titleButton="En savoir plus"
          />
          <FeatureCard
            title="Les soins énergétiques"
            description=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
            fugiat sit. Optio amet mollitia iusto!"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402549/IMG_7529_dc85ib.jpg"
            alt="Océane aux côtés de son cheval gris Ghost qui tourne la tête vers elle"
            lien="/services/energy-care"
            titleButton="En savoir plus"
          />
          <FeatureCard
            title="Pour les gardiens"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
            fugiat sit. Optio amet mollitia iusto!"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719403682/fortune-telling-4896472_1920_bxgeo8.jpg"
            alt="Cartes de tarot, photophore en arrière plan"
            lien="/services/guardians"
            titleButton="En savoir plus"
          />
        </div>
      </section>

      <section>
        <div className="relative">
          <Image
            className="w-full h-56 object-cover my-24"
            src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402555/312806563_1244487349726046_1342959404907481300_n_cx8q4j.jpg"
            alt="Océane et Hélios, son berger australien ticolore, dans la campagne, qui regardent dans la même direction"
            width={960}
            height={1280}
          />
          <Button
            titleButton="Témoignages"
            lien="/about/testimonials"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg bg-opacity-70 font-subtitle text-3xl text-dark-green transition duration-300 ease-in-out hover:bg-white"
          />
        </div>
      </section>
    </main>
  );
}
