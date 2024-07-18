import Image from "next/image";
import { Button } from "@/src/components/Button";
import Accordion from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import Link from "next/link";
import { GiButterfly } from "react-icons/gi";

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
            <section className="pt-8 text-justify">
              <div className="pt-8">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <GiButterfly />
                  </span>
                  <h3 className="font-subtitle pb-4">
                    Communication animale, énergétique et pathologies
                  </h3>
                </div>
                <p className="pb-10">
                  Une communication animale ou une séance énergétique ne posent
                  pas de diagnostic médical et ne remplacent pas l’avis des
                  divers professionnels de santé liés aux problèmes que vous
                  pouvez rencontrer avec votre animal. Si selon moi, ce que vous
                  me demandez nécessite au préalable un avis vétérinaire, je me
                  permettrais donc de vous rediriger vers un professionnel plus
                  adapté. (Mes années d&apos;expériences en tant qu&apos;
                  <Link
                    href="/about"
                    className="bg-white rounded-lg hover:text-dark-green hover:bg-beige hover:drop-shadow-lg"
                  >
                    infirmière vétérinaire
                  </Link>{" "}
                  me sont d&apos;une grande aide sur ce point.)
                </p>
              </div>
              <div className="flex">
                <span className="text-2xl pr-2">
                  <GiButterfly />
                </span>
                <h3 className="font-subtitle pb-4">Régler tous les soucis ?</h3>
              </div>
              <p className="pb-4">
                Ces prestations n’ont pas non plus pour but de résoudre lesdits
                problèmes, elles apportent de la compréhension et peuvent guider
                vers des solutions. Cela reste à vous, en tant que gardien, de
                faire le nécessaire en amont et en aval de la communication ou
                du soin énergétique.
              </p>
              <br />
              <div className="flex">
                <span className="text-2xl pr-2">
                  <GiButterfly />
                </span>
                <h3 className="font-subtitle pb-4">
                  Tenir compte de vous...et de moi
                </h3>
              </div>
              <p className="pb-4">
                Je ne communique pas si je suis malade, inhabituellement
                fatiguée ou émotionnellement non-disponible (ou tout autre
                évènement indépendant de ma volonté), afin de ne pas transmettre
                à votre animal quelque chose de négatif. Vous serez bien
                évidemment prévenu au préalable si tel était le cas, et la
                communication serait alors reportée. Via les CGV qui vous serons
                transmises lors de votre réservation, vous acceptez que la
                prestation puisse être retardée sur un délai de 15 jours.
              </p>
              <div className="py-8">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <GiButterfly />
                  </span>
                  <h3 className="font-subtitle pb-4">Pour conclure :</h3>
                </div>
                <p className="pb-10">
                  Chacun est libre de pratiquer la communication animale de la
                  manière qui lui convient, il n’y a pas de règle. J’ai modelé
                  mon éthique avec celle apprise aux côtés d’
                  <Link
                    href="https://www.anteluxia.com/"
                    className="bg-white rounded-lg hover:text-dark-green hover:bg-beige hover:drop-shadow-lg"
                  >
                    Anteluxia{" "}
                  </Link>{" "}
                  au cours de mes différentes formations pratiquées avec son
                  encadrement car ces principes me correspondent. Et j’espère
                  que cela vous conviendra également.
                </p>
                <h3 className="font-subtitle py-4 text-center">
                  Au plaisir d&apos;échanger avec vous et vos animaux !
                </h3>
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
            </section>
            <div className="bg-dark-beige rounded-lg my-8 p-2">
              <h3 className="font-bold mt-8 bg-white bg-opacity-50 rounded-lg p-2">
                Les détails de ma pratique pour chaque discipline :
              </h3>
              <div className="p-2">
                <div>
                  <Accordion title="Communication Animale">
                    <p className="text-justify">
                      • La communication animale ne sert pas à réprimander et/ou
                      culpabiliser votre animal. <br /> <br />• Ce n’est pas non
                      plus dans l’optique de vous culpabiliser vous. Votre
                      démarche est pleine d’amour et de bienveillance, et vous
                      faites au mieux. Vous continuerez de faire au mieux avec
                      ce qui vous aura été délivré de la part de votre animal.{" "}
                      <br />
                      <br /> • Je n’impose pas un nombre de problématiques à
                      aborder dans la communication défunt et dans la
                      communication exploration, mais cela doit rester dans la
                      mesure du raisonnable et en fonction de l’ampleur des
                      problématiques à soumettre à votre animal.
                    </p>
                  </Accordion>
                  <Accordion title="Soins énergétiques">
                    <p className="text-justify">
                      • Une séance énergétique ne remplace pas un avis, un
                      diagnostic, ni un acte vétérinaire, ou de tout autre
                      professionnel liés aux problèmes que peut rencontrer votre
                      animal. Encore une fois c’est un complément, une aide
                      supplémentaire. <br />
                      <br /> • Votre animal n’est d’ailleurs pas obligé d’avoir
                      de problèmes spécifiques pour recevoir une séance, cela
                      peut tout simplement être un moment d’apaisement et de
                      bien être à lui offrir.
                    </p>
                  </Accordion>
                  <Accordion title="Pour les gardiens">
                    <p className="text-justify">
                      • Ton éthique pour les guidances, oracles et autres
                      services, ta façon de faire, ce que ça permet ou non...
                    </p>
                  </Accordion>
                </div>
              </div>
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
