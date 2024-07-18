import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import Accordion from "@/src/components/Accordion";
import { GiUbisoftSun } from "react-icons/gi";
import { IoIosArrowDropright } from "react-icons/io";
import { PiHandHeartLight } from "react-icons/pi";
import { GiFallingLeaf } from "react-icons/gi";
import { HiOutlineBellAlert } from "react-icons/hi2";
import Link from "next/link";

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
          <p className="pt-8 text-center">
            Mes séances énergétiques se font sur la base du{" "}
            <strong>magnétisme.</strong>
            <span className="flex justify-center my-4">
              <GiUbisoftSun />
            </span>
            Il s’agit de libérer, nettoyer, rééquilibrer et harmoniser le corps
            énergétique de votre animal. Car tout est lié : physique, émotionnel
            et énergétique. Ils s’impactent les uns les autres, que ce soit dans
            le bon comme dans le mauvais sens.
            <span className="flex justify-center my-4">
              <GiUbisoftSun />
            </span>
            Je vais décharger et nettoyer les énergies polluées, puis recharger
            via une énergie spécifique et clairement demandée. Je ne transfère
            pas ma propre énergie, je deviens un canal pour décharger et
            recharger. Ainsi, réharmoniser le corps énergétique de votre animal
            lui apporte une aide supplémentaire pour le soulager, pour avancer
            dans la guérison et/ou tout simplement pour booster son bien-être.
            Le but final étant d’apporter apaisement, confort et lumière à votre
            animal.
            <span className="flex justify-center my-4">
              <GiUbisoftSun />
            </span>
            Votre animal n’est d’ailleurs pas obligé d’avoir de problèmes
            spécifiques pour recevoir une séance, cela peut tout simplement être
            un moment d’apaisement et de bien être à lui offrir.
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
            title="Quels sont les effets d'une séance énergétique ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402551/IMG_6874_rrkiyv.jpg"
          />
          <p className="pt-8 text-center">
            Les effets d’une séance peuvent se voir dans le concret, tout comme
            ils peuvent rester dans le subtil. Ils ne seront pas forcément
            immédiats, certaines libérations prennent plus de temps que
            d’autres.
            <span className="flex justify-center my-4">
              <GiUbisoftSun />
            </span>
            Le corps physique peut lui aussi être amené à terminer de purifier
            une libération et un nettoyage, ainsi ne soyez pas surpris si
            diarrhée, vomissement, inflammation ou autres symptômes physiques,
            comportement/émotion un peu exacerbé(e), énergie boostée ou encore
            fatigue émergeant à la suite d’une séance.
            <span className="flex justify-center my-4">
              <GiUbisoftSun />
            </span>
            Bien sûr, c’est à surveiller de près et les effets ne doivent pas
            durer dans le temps (pas plus de quelques jours) et l’avis d’un
            vétérinaire devra être pris si tel était le cas car des symptômes
            qui ne sont pas en corrélation avec la séance ont pu émerger en
            parallèle de leur côté.
          </p>
          <Button
            titleButton="Réserver un soin énergétique"
            lien="https://form.jotform.com/233515437828361"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Sur quoi agit une séance énergétique ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402554/IMG_7583_ky7o2f.jpg"
          />
          <div className="pt-8 text-justify">
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">Les mémoires karmiques bloquées</p>
            </div>
            <br />
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">
                Les émotions à libérer : stress, anxiété, fatigue, angoisse,
                colère, etc..
              </p>
            </div>
            <br />
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">Les noeuds énergétiques à libérer</p>
            </div>
            <br />
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">
                Le nettoyage et la libération des traumatismes : physiques et
                émotionnels.
              </p>
            </div>
            <br />
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">
                Les troubles physiques : douleurs, maladie, inflammation,
                cicatrisation…
              </p>
            </div>
            <br />
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">
                L&apos;harmonisation de la circulation énergétique
              </p>
            </div>
            <br />
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">
                Le rééquilibrage de l&apos;aura et des polarités
              </p>
            </div>
            <br />
            <div className="flex">
              <GiUbisoftSun className="w-6 h-6" />
              <p className="mx-2">La protection énergétique</p>
            </div>
          </div>
          <Button
            titleButton="Réserver un soin énergétique"
            lien="https://form.jotform.com/233515437828361"
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
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Les séances énergétiques peuvent s’adresser aux humains et
                    aux animaux, mais dans ma pratique, je ne traite pour le
                    moment que vos animaux.
                  </p>
                </div>
              </section>
            </Accordion>
            <Accordion title="Une séance en pratique">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Pour la séance, votre animal doit être au calme et au repos.
                    Il vaut mieux éviter qu&apos;il soit sollicité afin
                    qu&apos;il profite et s&apos;imprègne au mieux de la séance.
                    C&apos;est pour cela que dans cette optique, je fixerai avec
                    vous un rendez-vous plus précis que pour les réservations de
                    communication animale.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Le compte rendu vous sera fait par écrit. Mes séances
                    s’effectuent à distance, comme pour la communication
                    animale. Je me connecte à votre animal par les mêmes canaux,
                    et je travaille sur son corps énergétique.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Votre réservation sera définitive une fois le paiement reçu.
                    Vous recevrez par mail mon RIB afin de l&apos;effectuer dans
                    les plus brefs délais. Place pré réservée pendant 72h, passé
                    ce délai, la réservation sera annulée.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Il est possible de faire faire une séance à votre animal
                    seule ou bien en combo avec une communication animale.{" "}
                    <i>
                      (Voir &quot;Pack Accompagnement profondeur&quot; dans les
                      tarifs ci-dessous)
                    </i>
                  </p>
                </div>
              </section>
            </Accordion>
            <Accordion title="Types de séance et tarifs">
              <section className="text-justify">
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Les séances énergétiques animales – 50€
                    </h3>
                  </div>
                  <p className="pb-10">
                    <strong>Les soins énergétiques ont pour but :</strong>{" "}
                    <br />
                    • D&apos;apporter confort et bien-être :<br /> &gt;
                    Nettoyage, rééquilibrage et harmonisation des chakras <br />{" "}
                    &gt; Nœuds énergétiques à libérer <br /> &gt; Harmonisation
                    de la circulation énergétique <br /> &gt; Rééquilibrage de
                    l’aura et des polarités <br /> &gt; Protection énergétique
                    <br /> <br />• De libérer une ou plusieurs problématique(s)
                    spécifique(s) : <br /> &gt; Mémoires karmiques bloquées{" "}
                    <br /> &gt; Emotions à libérer (stress, anxiété, fatigue,
                    angoisse, colère, etc) <br /> &gt; Nettoyage et libération
                    des traumatismes (physiques et émotionnels) <br /> &gt;
                    Troubles physiques (douleurs, maladie, inflammation,
                    cicatrisation…) <br />
                  </p>
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <PiHandHeartLight />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Pack Accompagnement Profondeur – 115€
                    </h3>
                  </div>
                  <p className="pb-10">
                    <strong>• Communication animale :</strong> <br /> &gt; Libre
                    écoute de votre animal <br /> &gt; Général ou spécifique
                    (Problématique(s) / questionnement(s) spécifique(s)) <br />{" "}
                    &gt; Scan physique, énergétique et état émotionnel du moment{" "}
                    <br />
                    &gt; Transmission des messages de votre animal <br /> &gt;
                    Transmission de votre message de cœur <br /> <br />{" "}
                    <strong>• Séance énergétique </strong> <br /> &gt; Apporter
                    confort et bien-être <br /> &gt; Libérer des problématiques
                    impactant l’énergétique, l’émotionnel ou le physique <br />{" "}
                    <br />{" "}
                    <strong>
                      • Compte-rendu oral et écrit de l’ensemble des
                      prestations.
                    </strong>
                  </p>
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <HiOutlineBellAlert />
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Les Urgences ~ + 15€ au prix initial de la prestation
                      demandée
                    </h3>
                  </div>
                  <p className="pb-10">
                    <h4>Réalisée dans les 24 à 48h suivant la demande.</h4>
                    <strong>Dans quel cas :</strong> <br />
                    • Message (35 + 15€) : Transmission en urgence d’un message
                    concernant une situation. <br /> • Communication animale (65
                    + 15€) : Aborder une situation d’urgence + état d’esprit et
                    ressentis de votre animal. <br /> • Séance énergétique (50 +
                    15€) <br />
                    <h5 className="mt-8">
                      POUR TOUTE URGENCE, ME CONTACTER DIRECTEMENT VIA LE
                      <Link
                        href="/contact"
                        className="bg-dark-green bg-opacity-30 rounded-lg hover:text-dark-green hover:bg-beige hover:drop-shadow-lg"
                      >
                        {" "}
                        FORMULAIRE DU SITE.
                      </Link>
                    </h5>
                  </p>
                </div>
              </section>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver un soin"
          lien="https://form.jotform.com/233515437828361"
        />
      </div>
    </div>
  );
};

export default EnergyCare;
