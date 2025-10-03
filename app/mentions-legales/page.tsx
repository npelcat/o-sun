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

          <section className="bg-dark-beige p-6 rounded-lg">
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
            </div>
          </section>

          <section className="bg-dark-beige p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Crédits
            </h2>
            <p className="text-gray-700 leading-relaxed text-center">
              Textes et photographies : <strong>Océane Romaska</strong>. Toute
              reproduction, diffusion ou réutilisation est interdite sans
              autorisation écrite.
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

          <section className="bg-dark-beige p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Données personnelles
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les données collectées via ce site sont utilisées uniquement dans
              le cadre des prestations proposées. Pour plus de détails, veuillez
              consulter l&apos;article 17 des Conditions Générales de Vente
              relatif aux données personnelles. Conformément au RGPD, vous
              disposez d&apos;un droit d&apos;accès, de rectification, de
              suppression et d&apos;opposition en écrivant à :{" "}
              <a
                href="mailto:o.sun.voixanimale@gmail.com"
                className="text-blue-600 hover:underline"
              >
                o.sun.voixanimale@gmail.com
              </a>
              .
            </p>
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
