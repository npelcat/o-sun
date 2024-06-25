import { FeatureCard } from "../src/components/FeatureCard";
import { HomeCTA } from "../src/components/HomeCTA";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section>
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-16">
          <HomeCTA
            titleButton="Qui suis-je ?"
            image="/img/oceane/oce-horse/IMG_7558.jpg"
            lien="/about"
          />
          <HomeCTA
            titleButton="Mon éthique"
            image="/img/cat/IMG_1522.jpg"
            lien="/about/ethics"
          />
          <HomeCTA
            titleButton="Réservation"
            image="/img/oceane/oce-dogs/IMG_67278.jpg"
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
            image="/img/dogs/IMG_7056.jpg"
            lien="/services"
            titleButton="En savoir plus"
          />
          <FeatureCard
            title="Les soins énergétiques"
            description=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
            fugiat sit. Optio amet mollitia iusto!"
            image="/img/oceane/oce-horse/IMG_7529.jpg"
            lien="/services/energy-care"
            titleButton="En savoir plus"
          />
          <FeatureCard
            title="Pour les gardiens"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
            fugiat sit. Optio amet mollitia iusto!"
            image="/img/logos_and_free_pics/istockphoto-1385750847-612x612.jpg"
            lien="/services/guardians"
            titleButton="En savoir plus"
          />
        </div>
      </section>

      <section>
        <div className="relative">
          <Image
            className="w-full h-56 object-cover my-24"
            src="/img/oceane/oce-dogs/312806563_1244487349726046_1342959404907481300_n.jpg"
            alt="feuillage"
            width={960}
            height={1280}
          />
          <Link href="/about/testimonials">
            <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg bg-opacity-70 font-subtitle text-3xl text-dark-green transition duration-300 ease-in-out hover:bg-white">
              <h4>Témoignages</h4>
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
