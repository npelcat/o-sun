import Image from "next/image";
import { Button } from "@/src/components/Button";

export default function CGVPage() {
  return (
    <div className="pt-16 space-y-12">
      <h1 className="text-3xl font-bold font-subtitle px-4 pt-16 pb-5 text-center">
        Conditions Générales de Vente
      </h1>

      <div className="flex justify-center bg-beige">
        <div className="w-full md:w-4/5 lg:w-3/5 py-8 px-4 space-y-8 text-justify">
          {/* Préambule */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-subtitle text-center mb-6">
              O&apos;Sun Voix Animale
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes conditions générales de vente (CGV) encadrent les
              prestations de services proposées par O&apos;Sun Voix Animale,
              représentée par Océane. Elles sont applicables à toute commande
              effectuée via le site internet www.osunvoixanimale.com. En
              validant sa commande, le client reconnaît avoir pris connaissance
              et accepté l&apos;intégralité des présentes CGV.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Coordonnées de l&apos;entreprise
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>O&apos;Sun – Voix Animale</strong>
                </p>
                <p>SIRET : 97807356700015</p>
                <p>
                  Siège social : 7B rue de la Fontaine Geoffroy, 77520
                  Montigny-Lencoup
                </p>
                <p>Mail : o.sun.voixanimale@gmail.com</p>
                <p>Téléphone : 06 32 01 35 32</p>
              </div>
            </div>
          </section>

          {/* Éthique */}
          <section className="bg-dark-beige p-6 rounded-lg">
            <h3 className="text-xl font-bold font-subtitle mb-4 text-center">
              Mon éthique : une posture consciente, respectueuse et engagée
            </h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Chaque accompagnement que je propose, qu&apos;il s&apos;adresse à
              un humain ou à un animal, repose sur un socle éthique forgé par
              l&apos;expérience, l&apos;intuition, la responsabilité et
              l&apos;amour du vivant. Il m&apos;importe d&apos;agir dans un
              profond respect de chacun, en conscience et avec le cœur.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Je m&apos;engage à accompagner avec sincérité, intégrité et
                  bienveillance, en respectant le libre arbitre de tous les
                  êtres.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Mes pratiques sont complémentaires et ne se substituent jamais
                  à un suivi médical, vétérinaire, comportemental ou
                  thérapeutique.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Je ne cherche pas à « faire » ou à « réparer » : je me mets au
                  service d&apos;un processus naturel, dans l&apos;écoute et le
                  respect des rythmes de chacun.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Si une séance ne semble pas juste ou si l&apos;énergie ne
                  circule pas, je me réserve le droit de reporter ou
                  d&apos;annuler.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Je veille à respecter mon propre état intérieur : si je ne
                  suis pas apte à accompagner dans les meilleures conditions, la
                  séance sera reportée.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Chaque soin est réalisé dans un espace énergétique sacré,
                  sécurisé, avec neutralité et ancrage.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Je ne vends ni miracle ni promesse. Je transmets ce que je
                  reçois avec clarté, transparence et discernement.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Je suis une intermédiaire, pas une détentrice de vérité.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Toute communication ou soin est effectué uniquement avec le
                  consentement conscient du gardien, de la personne concernée,
                  et de l&apos;animal.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Je respecte le silence ou le choix de non-communication
                  d&apos;un animal. Je ne force jamais.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Je communique avec toutes les espèces, vivantes ou décédées.
                  Pour les animaux défunts, un délai de 6 semaines est respecté
                  avant toute communication.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Le soin ou la communication n&apos;a aucune visée miraculeuse.
                  Ils soutiennent un chemin personnel, sans garantir de
                  transformation immédiate.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  La communication animale n&apos;est jamais un outil de
                  reproche, ni envers l&apos;animal, ni envers son gardien. Elle
                  se fait dans l&apos;écoute et la co-responsabilité.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">
                  Les comptes rendus sont transmis de manière fidèle, par vocaux
                  WhatsApp ou fichier PDF selon votre préférence.
                </p>
              </div>
            </div>
          </section>

          {/* Décoration */}
          <div className="flex justify-center py-8">
            <Image
              src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720856658/fox-7405603_1920_etg9z1.png"
              alt=""
              aria-hidden="true"
              width={1920}
              height={1358}
              loading="lazy"
              className="object-cover w-1/2 md:w-1/6"
            />
          </div>

          {/* Articles des CGV */}
          <div className="space-y-8">
            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 1 – Champ d&apos;application
              </h3>
              <p className="text-gray-700 mb-4">
                Les présentes CGV s&apos;appliquent à toutes les prestations
                proposées par O&apos;Sun Voix Animale :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Communications animales</li>
                <li>Séances énergétiques pour animaux ou humains</li>
                <li>Guidances</li>
                <li>Ateliers / stages</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Elles prévalent sur toutes autres conditions, sauf acceptation
                expresse et écrite de notre part. Toute commande implique
                l&apos;adhésion pleine et entière du client aux présentes
                conditions.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 2 – Informations précontractuelles
              </h3>
              <p className="text-gray-700">
                Avant toute commande, les informations suivantes sont clairement
                communiquées au client : les caractéristiques principales des
                services, les tarifs en vigueur (exprimés en euros et HT, TVA
                non applicable selon l&apos;article 293B du CGI), les modalités
                de réalisation des prestations, les coordonnées de contact, les
                modalités de rétractation, de réclamation, ou de résiliation.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 3 – Commande
              </h3>
              <p className="text-gray-700 mb-4">
                Toute commande validée est considérée comme ferme et définitive.
                Le paiement s&apos;effectue à la commande. Il engage le client,
                qui reconnaît avoir lu et accepté les présentes CGV.
              </p>
              <p className="text-gray-700">
                Le client dispose d&apos;un droit de rétractation de 14 jours à
                compter de la validation, sauf exceptions prévues par le Code de
                la consommation.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 4 – Délais et exécution
              </h3>
              <p className="text-gray-700 mb-4">
                Les prestations sont réalisées dans le délai communiqué lors de
                la commande, en fonction des disponibilités affichées. Ce délai
                peut être prolongé (jusqu&apos;à 15 jours supplémentaires) en
                cas de maladie ou d&apos;imprévu de la part de O&apos;Sun.
              </p>
              <p className="text-gray-700">
                En cas de non-exécution à la date convenue, le client peut
                demander la résolution du contrat dans les conditions prévues
                par le Code de la consommation.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 5 – Rétractation et annulation
              </h3>
              <p className="text-gray-700 mb-4">
                Le client dispose d&apos;un délai de 7 jours pour exercer son
                droit de rétractation, sauf si la prestation a commencé avec son
                accord express avant la fin de ce délai.
              </p>
              <p className="text-gray-700 mb-4">
                Plus aucune demande de remboursement ne pourra être faite à
                partir de 48h avant le jour sélectionné de réservation,
                représentant le premier jour de la période de rencontre.
              </p>
              <p className="text-gray-700">
                En cas d&apos;annulation après ce délai, une indemnité
                forfaitaire de 20 % pourra être retenue.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Article 6 – Prix</h3>
              <p className="text-gray-700">
                Les tarifs sont indiqués sur le site internet. Ils sont exprimés
                en euros, hors taxes. O&apos;Sun se réserve le droit de les
                modifier à tout moment. Le prix en vigueur au moment de la
                commande reste applicable pendant 7 jours.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 7 – Paiement
              </h3>
              <p className="text-gray-700 mb-4">
                Le paiement est exigible à la commande. Il peut se faire par :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Virement bancaire (distanciel et présentiel)</li>
                <li>Espèces ou chèque (uniquement en présentiel)</li>
              </ul>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 8 – Remboursement
              </h3>
              <p className="text-gray-700 mb-4">
                Aucun remboursement ne sera accordé sur la base d&apos;une
                absence de résultat, d&apos;attentes non comblées, ou
                d&apos;erreurs perçues dans le compte rendu.
              </p>
              <p className="text-gray-700 mb-4">
                Un remboursement est envisageable dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  L&apos;animal refuse de communiquer ou de recevoir un soin à
                  plusieurs reprises (au moins 3 tentatives)
                </li>
                <li>
                  Retard de réalisation supérieur au délai prévu, sans
                  possibilité de report
                </li>
                <li>
                  Incapacité de O&apos;Sun à réaliser la prestation dans les
                  meilleures conditions
                </li>
              </ul>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 9 – Garanties légales
              </h3>
              <p className="text-gray-700">
                Le client bénéficie de la garantie légale de conformité et de la
                garantie contre les vices cachés, conformément aux articles
                L.217-3 et suivants du Code de la consommation.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 10 – Responsabilités
              </h3>
              <p className="text-gray-700 mb-4">
                Les prestations proposées relèvent du domaine spirituel et du
                bien-être. Elles ne sont pas fondées sur des bases
                scientifiques.
              </p>
              <p className="text-gray-700">
                Aucune responsabilité ne pourra être engagée en cas de
                non-résultat ou de mauvais usage. O&apos;Sun ne réalise aucun
                acte médical.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 11 – Propriété intellectuelle
              </h3>
              <p className="text-gray-700">
                Tous les textes, images, contenus et supports utilisés dans le
                cadre des prestations sont la propriété exclusive de O&apos;Sun.
                Toute reproduction, diffusion ou réutilisation est interdite
                sans autorisation écrite.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 12 – Juridiction compétente
              </h3>
              <p className="text-gray-700">
                En cas de litige non résolu à l&apos;amiable, le différend sera
                porté devant les tribunaux compétents selon les règles de droit
                commun.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 13 – Langue
              </h3>
              <p className="text-gray-700">
                Les présentes CGV sont rédigées en français. En cas de
                traduction, seule la version française fera foi.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 14 – Médiation et litige
              </h3>
              <p className="text-gray-700">
                Conformément à la législation, le client peut recourir à un
                service de médiation ou à la plateforme de Règlement en Ligne
                des Litiges de la Commission européenne :{" "}
                <a
                  href="https://webgate.ec.europa.eu/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  https://webgate.ec.europa.eu/odr/
                </a>
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 15 – Loi applicable
              </h3>
              <p className="text-gray-700">
                Les présentes CGV sont soumises au droit français.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 16 – Archivage
              </h3>
              <p className="text-gray-700">
                O&apos;Sun archive les bons de commande et factures sur un
                support fiable et sécurisé, constituant une copie fidèle
                conforme aux exigences légales.
              </p>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Article 17 – Données personnelles
              </h3>
              <p className="text-gray-700 mb-4">
                Les données collectées sont strictement nécessaires à la
                réalisation des prestations. Elles ne sont ni cédées, ni
                vendues, ni partagées sans consentement.
              </p>
              <p className="text-gray-700">
                Conformément au RGPD, vous disposez des droits d&apos;accès,
                rectification, suppression, opposition et portabilité. Pour
                exercer ces droits :{" "}
                <a
                  href="mailto:o.sun.voixanimale@gmail.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  o.sun.voixanimale@gmail.com
                </a>
              </p>
            </article>

            {/* Formulaire de rétractation */}
            <article className="bg-dark-beige p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Annexe : Formulaire de rétractation
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                (à envoyer par mail ou courrier recommandé dans les 14 jours
                suivant la commande)
              </p>
              <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-700 mb-4">
                  <strong>À l&apos;attention de :</strong> O&apos;Sun – 7B rue
                  de la Fontaine Geoffroy – 77520 Montigny-Lencoup
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Je vous informe, par la présente, de ma volonté de me
                  rétracter du contrat portant sur la prestation suivante :
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Commandée le : ……………………………</p>
                  <p>Nom et prénom : ……………………………</p>
                  <p>Adresse : ……………………………………</p>
                  <p>Signature : ……………………………………</p>
                  <p>Date : ………………………………………</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* Bouton de contact */}
      <div className="flex justify-center mt-16 pb-12">
        <Button titleButton="Réserver un service" link="/contact/booking" />
      </div>
    </div>
  );
}
