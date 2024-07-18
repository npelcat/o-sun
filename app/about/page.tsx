import Accordion from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { NextPage } from "next";
import Image from "next/image";
import { IoIosArrowDropright } from "react-icons/io";

const AboutIndex: NextPage = () => {
  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Qui suis-je ?
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="py-8 w-full md:w-3/5  px-4">
          <div>
            <CardTitlePhoto
              title="Océane, (définition de toi en 3, 4 mots)"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402550/IMG_6825_tdlhcg.jpg"
            />
            <p className="pt-8">
              Ton parcours en quelques lignes, ce qui t&apos;as ammené ici :
              <br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed non risus. Suspendisse lectus tortor, dignissim sit amet,
              adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
              diam. Maecenas ligula massa, varius a, semper congue, euismod non,
              mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend
              mi, non fermentum diam nisl sit amet erat.
            </p>
            <div className="flex justify-center py-8">
              <Image
                className="w-1/2 h-full md:w-1/6 item-center object-cover"
                loading="lazy"
                src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720856658/fox-7405603_1920_etg9z1.png"
                alt="renard qui dort"
                width="1920"
                height="1358"
              />
            </div>
            <p>
              <strong>
                Pour en savoir plus, vous pouvez consulter la partie diplômes et
                formations ci-dessous.
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Mes diplômes et formations"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402552/IMG_7198_r1dwqk.jpg"
          />
          <div>
            <Accordion title="Ma formation en communication Animale">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Module 1 : </strong>
                    Diplômes et/ou formations suivies en com animale, détails
                    des modules, quelle formatrice...
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Module 2 : </strong>
                    Etc...
                  </p>
                </div>
                <br />
              </section>
            </Accordion>
            <Accordion title="Ma formation en soins énergétiques">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Formation 1 : </strong>
                    Diplômes et/ou formations suivies en soins énergétiques, ce
                    qui s&apos;en rapproche de près ou de loin et qui t&apos;a
                    aidé à développer ça.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Formation 2 : </strong>
                    Etc...
                  </p>
                </div>
                <br />
              </section>
            </Accordion>
            <Accordion title="Ma formation pour les autres services">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Formation 1 : </strong>
                    Diplômes et/ou formations suivies en oracles, guidances, etc
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Formation 2 : </strong>
                    Etc...
                  </p>
                </div>
                <br />
              </section>
            </Accordion>
            <Accordion title="Mon ancienne vie">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>
                      Formation d&apos;Auxiliaire Sépcialisée Vétérinaire ~
                      Diplôme passé et obtenu en 2012 ?{" "}
                    </strong>{" "}
                    <br />
                    Combien d&apos;années d&apos;expérience, les compétences
                    tranverses que ça peut t&apos;apporter dans le cadre de ta
                    nouvelle activité : Exemple : comprendre les propriétaires,
                    pouvoir distinguer rapidement un problème qui nécessite une
                    consultation vétérinaire...
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Formation 2 éventuelle : </strong>
                    Etc...
                  </p>
                </div>
                <br />
              </section>
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

export default AboutIndex;
