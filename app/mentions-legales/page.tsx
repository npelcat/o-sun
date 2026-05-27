import { Button } from "@/src/components/Button";

export default function MentionsLegalesPage() {
  return (
    <div className="pt-16 space-y-12">
      <h1 className="text-3xl font-bold font-subtitle px-4 pt-16 pb-5 text-center">
        Mentions Légales
      </h1>

      <div className="flex justify-center bg-beige">
        <div className="w-full md:w-4/5 lg:w-3/5 py-8 px-4 space-y-8 text-justify">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Éditeur du site
            </h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>O&apos;Sun – Voix Animale</strong>
              </p>
              <p>Représentée par : Océane Romaska</p>
              <p>SIRET : 97807356700015</p>
              <p>
                Siège social : 7B rue de la Fontaine Geoffroy, 77520
                Montigny-Lencoup
              </p>
              <p>
                Email :{" "}
                <a
                  href="mailto:o.sun.voixanimale@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  o.sun.voixanimale@gmail.com
                </a>
              </p>
              <p>Téléphone : 06 32 01 35 32</p>
            </div>
          </section>

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Responsable de la publication
            </h2>
            <p className="text-gray-700 leading-relaxed text-center">
              La responsable de la publication est Océane Romaska.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Hébergement
            </h2>
            <div className="space-y-4 text-gray-700 text-sm">
              <div>
                <p className="font-semibold">Site web</p>
                <p>Vercel Inc.</p>
                <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                <p>
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://vercel.com
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  Hébergement du back-office (Strapi)
                </p>
                <p>Koyeb SAS</p>
                <p>91 rue du Faubourg Saint-Honoré, 75008 Paris, France</p>
                <p>
                  <a
                    href="https://www.koyeb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://www.koyeb.com
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  Hébergement de la base de données
                </p>
                <p>Supabase Inc.</p>
                <p>970 Toa Payoh North, #07-04, Singapore 318992</p>
                <p>
                  Région d&apos;hébergement des données : Europe (Frankfurt)
                </p>
                <p>
                  <a
                    href="https://www.koyeb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://supabase.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Crédits
            </h2>
            <p className="text-gray-700 leading-relaxed text-center">
              Textes et photographies : <strong>Océane Romaska</strong>. Toute
              reproduction, diffusion ou réutilisation est interdite sans
              autorisation écrite.
            </p>
          </section>

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Développement
            </h2>
            <p className="text-gray-700 leading-relaxed text-center">
              Ce site a été développé par <strong>Nadege Pelcat</strong>,
              développeuse web indépendante, agissant en qualité de
              sous-traitante au sens de l&apos;article 28 du RGPD. Contact :
              pelcat.nd@gmail.com
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Propriété intellectuelle
            </h2>
            <p className="text-gray-700 leading-relaxed">
              L&apos;ensemble du contenu présent sur ce site (textes et images)
              est la propriété exclusive de O&apos;Sun, sauf mention contraire.
              Certaines illustrations proviennent de banques d’images libres de
              droits telles que
              <a
                href="https://www.pexels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {" "}
                Pexels
              </a>{" "}
              et
              <a
                href="https://pixabay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {" "}
                Pixabay
              </a>
              . Toute reproduction, modification ou exploitation sans
              autorisation écrite préalable est strictement interdite.
            </p>
          </section>

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Données personnelles
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <p>
                Les données collectées via ce site (nom, prénom, adresse email,
                numéro de téléphone, informations relatives aux animaux de
                compagnie) sont traitées par O&apos;Sun – Voix Animale en sa
                qualité de responsable du traitement, sur la base légale de
                l&apos;exécution de mesures précontractuelles (article 6.1.b du
                RGPD).
              </p>
              <p>
                Ces données sont hébergées sur Supabase (Frankfurt, Allemagne)
                et transitent via Resend (États-Unis) pour l&apos;envoi des
                notifications par email. Ces transferts sont encadrés par des
                accords de traitement des données (DPA) conformes au RGPD.
              </p>
              <p>
                Les données sont conservées pendant une durée maximale de 2 ans
                à compter du dernier contact, puis supprimées automatiquement.
              </p>
              <div>
                <p className="font-semibold mb-2">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <p>
                      <strong>Droit d&apos;accès</strong> : obtenir une copie de
                      vos données
                    </p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <p>
                      <strong>Droit de rectification</strong> : corriger des
                      données inexactes
                    </p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <p>
                      <strong>Droit à l&apos;effacement</strong> : demander la
                      suppression de vos données
                    </p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <p>
                      <strong>Droit d&apos;opposition</strong> : vous opposer au
                      traitement
                    </p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <p>
                      <strong>Droit à la portabilité</strong> : recevoir vos
                      données dans un format lisible
                    </p>
                  </li>
                </ul>
              </div>
              <p>
                Pour exercer ces droits, contactez :{" "}
                <a
                  href="mailto:o.sun.voixanimale@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  o.sun.voixanimale@gmail.com
                </a>
                . Délai de réponse : 1 mois maximum.
              </p>
              <p>
                Pour toute réclamation, vous pouvez également contacter la CNIL
                :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site n&apos;utilise pas de cookies à des fins de suivi ou
              d&apos;analyse. En cas d&apos;évolution future, une bannière
              d&apos;information et un système de consentement seront mis en
              place conformément à la réglementation.
            </p>
          </section>
        </div>
      </div>

      <div className="flex justify-center mt-16 pb-12">
        <Button titleButton="Retour à l'accueil" link="/" />
      </div>
    </div>
  );
}
