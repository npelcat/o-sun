import { Button } from "@/src/components/Button";
import { NextPage } from "next";
import Accordion from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { PiMoonStarsThin } from "react-icons/pi";
import { IoIosArrowDropright } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { GiFallingLeaf } from "react-icons/gi";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { PiHandHeartLight } from "react-icons/pi";
import Link from "next/link";

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
          <p className="pt-8 text-center">
            La communication animale vous permet d&apos;en apprendre un peu plus
            sur votre animal à travers ses ressentis, ses besoins, ses envies,
            ce qu&apos;il apprécie ou pas, découvrir ou redécouvrir son
            caractère, son être. Elle peut également aider à comprendre
            certaines situations, certains comportements, certaines émotions qui
            vous interrogent.
            <span className="flex justify-center my-4">
              <PiMoonStarsThin />
            </span>
            Vous pouvez lui délivrer un message de coeur à travers moi, et il
            peut également vous délivrer ses messages. Nous créons un échange,
            une écoute, pour une meilleure compréhension de l&apos;autre, et
            vous permettre de continuer d&apos;avancer ensemble dans la
            bienveillance et l&apos;amour.
            <span className="flex justify-center my-4">
              <PiMoonStarsThin />
            </span>
            La communication animale est une ouverture de dialogue avec votre
            animal. Vous devez vous engager à faire preuve d&apos;une écoute
            attentive et réceptive de ce qui vous sera transmis, que vous soyez
            d&apos;accord ou non avec votre animal.
          </p>
          <Button
            titleButton="Réserver une communication"
            lien="https://form.jotform.com/232924829211052"
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
            <Accordion title="Avec qui puis-je communiquer ?">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Les demandes de prestations sont effectuées uniquement par
                    le ou les gardiens des animaux. Si vous souhaitez offrir une
                    communication à quelqu’un pour son animal, vous avez la
                    possibilité d’offrir cela sous forme de carte cadeau.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Dans la même optique, je ne communique pas avec des animaux
                    de cirque, zoo, poney club etc. De manière générale, avec
                    aucun animal dont vous n’êtes pas le gardien.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Les communications animales sont réalisées à distance, via
                    photos. Vous n’avez pas besoin d’être disponible.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Je communique avec tout type d&apos;animal, quelque soit son
                    espèce, vivant ou défunt.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Il y a un délai d’attente de six semaines après le décès
                    d’un animal pour pouvoir communiquer avec lui (de manière
                    éthique, délai indépendant de mon propre délai d’attente).
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <CgDanger />
                  </span>
                  <p>Je ne communique pas avec les animaux perdus.</p>
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
                    Je ne donne pas de jour précis de réalisation de la
                    communication, étant donné qu’elle est effectuée en fonction
                    de la disponibilité de votre animal. Je m&apos;adapte à lui,
                    et à moi. Elle sera faite sur la semaine où je vous aurais
                    réservé une place et vous serez tenus au courant lorsqu’elle
                    sera conclue, afin que nous puissions prévoir un créneau
                    pour le compte rendu oral. Les comptes rendus
                    s&apos;effectuent donc plutôt en fin de semaine, vous êtes
                    tenus au courant si je rencontrai un léger retard de
                    planning.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Je me présente toujours à votre animal avant de commencer,
                    en lui expliquant qui m’envoie et pourquoi.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Je n’aborde pas les problématiques sous forme de listing de
                    questions. Elles sont abordées quand je sens que c’est le
                    bon moment au cours de la communication et parfois, c’est
                    l’animal qui l’aborde de lui-même. Je viens à lui avec une
                    intention et il la perçoit.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Parfois, un animal refuse de communiquer ou de dévoiler
                    certaines choses. Il faut lui laisser le temps mais aussi le
                    choix. Je me connecte plusieurs fois aux animaux et je vais
                    à leur rythme.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    Les réservations se font donc par semaine de disponibilité.
                    Ces dernières sont régulièrement communiquées en story sur
                    mon compte Instagram, et sont mises à jour sur le formulaire
                    de réservation.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    La réservation sera effective uniquement après réception du
                    paiement. Vous aurez un formulaire à remplir avec toutes les
                    informations nécessaires au bon déroulement de la
                    communication à me transmettre. En réponse, je vous donnerai
                    mes prochaines disponibilités ainsi que le moyen de
                    règlement (RIB). Si cela vous convient, votre place sera
                    alors préréservée pendant 72h, le temps de recevoir votre
                    paiement et valider ainsi définitivement la demande de
                    prestation.
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright />
                  </span>
                  <p>
                    <strong>Les compte-rendus : </strong> <br />
                    Ils se font à l’oral par : <br /> • Appel téléphonique{" "}
                    <br /> • Visio (Google Meet) <br /> • Message vocaux
                    (Whats’App) <br /> <br /> Si vous souhaitez garder une trace
                    de notre échange, il est possible de demander un
                    compte-rendu écrit en supplément (10€).
                  </p>
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <CgDanger />
                  </span>
                  <p>
                    Des erreurs d’interprétation de ma part sont possibles,
                    c’est pourquoi le débrief entre vous et moi est important,
                    d’où mon choix de faire les comptes rendus à l’oral (visio
                    ou téléphone). C’est en discutant ensemble que nous pourrons
                    exprimer au mieux les mots et les maux de votre animal. De
                    plus, par écrit, vous pouvez vous aussi mal interpréter
                    l’une de mes retranscriptions. Pour ne pas rester sur une
                    méprise, ce mode de compte rendu reste l’idéal. Vous pourrez
                    néanmoins demander un compte rendu écrit en supplément.
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
                      Communication animale guidée par les cartes Oracles ~ 20 €
                    </h3>
                  </div>
                  <p className="pb-10">
                    L&apos;animal peut aborder une situation spécifique qui le
                    concerne, vous concerne vous, ou vous concerne tous les
                    deux. Il peut aborder un besoin, une envie, quelque chose
                    qui a besoin d’être modifié, ou vous adresser tout
                    simplement un message. <br /> <strong>En pratique :</strong>{" "}
                    <br />• Je tire les cartes et canalise l’information que
                    souhaite vous adresser spécifiquement votre animal via la
                    carte. <br /> • Disponible pour vivant et défunt <br /> •
                    Pour recevoir le message du jour/du moment de votre animal{" "}
                    <br /> • Compte rendu par message vocal (PDF en option){" "}
                    <br />
                  </p>
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale message ~ 35 €
                    </h3>
                  </div>
                  <p className="pb-10">
                    Elle est idéale lorsque vous devez prévenir votre animal
                    d&apos;un évènement spécifique à venir tel que :
                    l&apos;arrivée d&apos;un nouvel animal, une future
                    naissance, l&apos;emménagement d&apos;une nouvelle personne,
                    un déménagement, une séparation, une opération chirurgicale
                    à venir, un départ en vacances/week end sans lui (pour lui
                    parler de la pension ou des proches qui vont le garder),
                    devoir prendre un transport inhabituel (avion, bateau,
                    train, etc), et tout autre évènement pouvant chambouler le
                    quotidien de votre animal et/ou qui peut lui causer un
                    certain stress. <br /> <strong> En pratique : </strong>{" "}
                    <br /> • Libre écoute de votre animal <br /> • Message à lui
                    transmettre : concernant un évènement à venir, une situation
                    spécifique, ou tout simplement un message particulier à lui
                    délivrer <br /> • Réaction de votre animal
                    <br /> • Compte rendu oral : téléphone ou visio. (PDF en
                    option) <br />
                  </p>
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale ~ 65 €
                    </h3>
                  </div>
                  <p className="pb-10">
                    Nous voyons comment se sent votre animal dans son quotidien
                    et ce qu&apos;il a à délivrer, recevoir ses messages, et lui
                    adresser votre message de cœur, mais en plus, vous vous
                    interrogez sur certains points, vous avez des questions. Je
                    n&apos;impose pas un nombre limites de problématiques, mais
                    il faut rester raisonnable quant à la quantité et
                    l&apos;ampleur des points à aborder, des questions à
                    soulever. Je me garde le droit de vous dire qu&apos;il y a
                    trop de choses à voir en une seule fois, ou trop de choses
                    trop lourdes à aborder d&apos;un coup. <br />{" "}
                    <strong>En pratique :</strong> <br /> • Libre écoute de
                    votre animal <br /> • Général : Lieu de vie / Relation
                    gardien(s) / besoin(s) et envie(s) <br /> • Spécifique :
                    Aborder des problématiques / questionnements qui vous
                    interrogent <br /> • Scan physique, énergétique et état
                    émotionnel du moment <br /> • Recevoir les messages de votre
                    animal <br /> • Transmission de votre message de cœur <br />{" "}
                    • Compte rendu oral : téléphone ou visio. (PDF en option)
                  </p>
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale défunt ~ 65 €
                    </h3>
                  </div>
                  <p className="pb-10">
                    J&apos;attends au moins 6 semaines après le décès de votre
                    animal pour communiquer avec lui, pour ne pas perturber
                    l&apos;élévation de son âme, et lui laisser du temps ainsi
                    qu&apos;à vous de conscientiser son départ. <br /> Il faut
                    veiller à accorder aux défunts le repos qu&apos;ils
                    méritent, c&apos;est pourquoi je ne communiquerai pas plus
                    de deux fois avec un animal défunt (cela peut être 6
                    semaines après son départ puis quelques mois/un an plus tard
                    si vous en ressentez le besoin). <br /> <br />
                    Une communication avec les défunts vous permet de lui
                    adresser votre message de cœur, recevoir ses messages à lui,
                    comprendre les dernières choses qu&apos;il y a à comprendre,
                    savoir comment il se sent là où il est à présent. Une
                    manière de dire aurevoir avec tendresse et bienveillance.{" "}
                    <br /> <strong>En pratique :</strong>
                    <br /> • Libre écoute de votre animal <br /> • Comment se
                    sent-il actuellement ? <br /> • Aborder des questionnements
                    spécifiques <br /> • Recevoir les messages de votre animal{" "}
                    <br /> • Transmission de votre message de cœur <br />•
                    Compte rendu oral : téléphone ou visio. (PDF en option)
                  </p>
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale de suivi ~ 20 €
                    </h3>
                  </div>
                  <p className="pb-10">
                    <strong>Dans quel cas :</strong> <br />
                    • La communication animale réalisée précédemment a soulevé
                    des points spécifiques, et après avoir mis des choses en
                    place, vous souhaitez contrôler ces points. <br />
                    • Vous souhaitez demander les ressentis de votre animal
                    quelques temps après une séance énergétique. <br />
                    <br /> Nous pouvons alors faire un suivi de la première
                    prestation, si la demande est faite dans les 2 mois qui
                    suivent le compte-rendu. <br /> <br />
                    <i>
                      Valable à la suite des communication animale,
                      communication message et des séances énergétiques.
                    </i>
                    <br />
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
            <Accordion title="Les PACKS">
              <section className="text-justify">
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
                      <PiHandHeartLight />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Pack Accompagnement Fin de vie – 160€
                    </h3>
                  </div>
                  <p className="pb-10">
                    <strong>• 2 communications animales :</strong> <br /> &gt;
                    Une à la prise de contact : soit lors d’une situation
                    d’urgence, soit malheureusement parce que vous savez que
                    votre animal n’a plus que quelques temps à passer à vos
                    côtés. <br /> &gt; Permet de l’avertir, prendre ses
                    ressentis, savoir ce qu’il souhaite, vous transmettre l’un
                    et l’autre vos messages. <br />
                    <br /> <strong>
                      • Communication animale défunt :{" "}
                    </strong>{" "}
                    <br /> &gt; Environ 6 semaines après le départ de votre
                    compagnon, je réalise une communication animale défunt.{" "}
                    <br />
                    <br />{" "}
                    <strong>
                      • Compte-rendu oral et écrit de l’ensemble des
                      prestations.
                    </strong>
                  </p>
                </div>
              </section>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver une communication"
          lien="https://form.jotform.com/232924829211052"
        />
      </div>
    </div>
  );
};

export default ServicesIndex;
