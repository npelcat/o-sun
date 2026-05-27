import { Button } from "@/src/components/Button";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-16 space-y-12">
      <h1 className="text-3xl font-bold font-subtitle px-4 pt-16 pb-5 text-center">
        Politique de confidentialité
      </h1>

      <div className="flex justify-center bg-beige">
        <div className="w-full md:w-4/5 lg:w-3/5 py-8 px-4 space-y-8 text-justify">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Responsable du traitement
            </h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                Le responsable du traitement des données collectées via ce site
                est :
              </p>
              <p>
                <strong>O&apos;Sun – Voix Animale</strong>, représentée par
                Océane Romaska
              </p>
              <p>SIRET : 97807356700015</p>
              <p>
                Siège social : 7B rue de la Fontaine Geoffroy, 77520
                Montigny-Lencoups
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
            </div>
          </section>

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Données collectées et finalités
            </h2>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>
                Dans le cadre du formulaire de réservation, les données
                suivantes sont collectées :
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Nom et prénom</strong> (obligatoire) :
                    identification du client pour le suivi de la réservation
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Adresse email</strong> (obligatoire) : communication
                    relative à la réservation
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Numéro de téléphone</strong> (optionnel) : contact
                    complémentaire si nécessaire
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Nom et type de l&apos;animal</strong> (obligatoire)
                    : identification de l&apos;animal concerné par la prestation
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Informations libres sur l&apos;animal</strong>{" "}
                    (optionnel) : âge, race, caractère, contexte de vie,
                    éléments importants communiqués librement par le client et
                    nécessaires à la réalisation de la prestation
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Composition du foyer</strong> (optionnel) : autres
                    animaux, personnes vivant avec l&apos;animal, environnement
                    général
                  </p>
                </div>
              </div>
              <p>
                Ces données sont collectées exclusivement dans le but de traiter
                la demande de réservation et de réaliser les prestations
                proposées par O&apos;Sun – Voix Animale. Elles ne sont utilisées
                à aucune autre fin, et ne font l&apos;objet d&apos;aucun
                profilage ni traitement automatisé.
              </p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Base légale du traitement
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Les données sont traitées sur la base de l&apos;
              <strong>
                exécution de mesures précontractuelles à la demande de la
                personne concernée
              </strong>{" "}
              (article 6.1.b du Règlement Général sur la Protection des Données
              — RGPD). En soumettant le formulaire de réservation, le client
              engage une démarche contractuelle avec O&apos;Sun – Voix Animale,
              ce qui justifie la collecte et le traitement des données
              nécessaires à la réalisation de la prestation.
            </p>
          </section>

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Durée de conservation
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Les données personnelles sont conservées pendant une durée
              maximale de <strong>2 ans</strong> à compter du dernier contact ou
              de la dernière mise à jour de la réservation. Passé ce délai,
              elles sont supprimées automatiquement de manière sécurisée.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Destinataires des données et hébergement
            </h2>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>
                Les données collectées sont accessibles uniquement par
                O&apos;Sun – Voix Animale dans le cadre de la gestion des
                réservations. Elles ne sont ni vendues, ni cédées, ni partagées
                avec des tiers à des fins commerciales.
              </p>
              <p>
                Dans le cadre du fonctionnement technique du site, les données
                transitent ou sont stockées auprès des sous-traitants suivants,
                avec lesquels un accord de traitement des données (DPA) conforme
                au RGPD a été conclu :
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Supabase Inc.</strong> — hébergement de la base de
                    données, région Europe (Frankfurt, Allemagne)
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Vercel Inc.</strong> (États-Unis) — hébergement du
                    site web et des API. Vercel est soumis au CLOUD Act
                    américain ; un DPA encadrant ce transfert est en place,
                    incluant les clauses contractuelles types de la Commission
                    européenne
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Resend Inc.</strong> (États-Unis) — envoi des emails
                    de notification. L&apos;adresse email du client transite par
                    leurs serveurs lors de l&apos;envoi. Un DPA est en place
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Koyeb SAS</strong> (France) — hébergement du
                    back-office de gestion du contenu éditorial du site (aucune
                    donnée personnelle des clients n&apos;y est stockée)
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Mesure d&apos;audience
            </h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Ce site utilise <strong>Vercel Analytics</strong>, un outil de
                mesure d&apos;audience qui collecte des données agrégées de
                navigation (pages visitées, pays d&apos;origine, type
                d&apos;appareil). Ces données sont anonymisées et ne permettent
                pas d&apos;identifier individuellement les visiteurs.
              </p>
              <p>
                Vercel Analytics ne dépose pas de cookie de tracking. Son
                utilisation ne nécessite pas de consentement préalable au titre
                de la réglementation ePrivacy. Pour plus d&apos;informations :{" "}
                <a
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  politique de confidentialité de Vercel Analytics
                </a>
                .
              </p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Vos droits
            </h2>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>
                Conformément au RGPD, vous disposez des droits suivants
                concernant vos données personnelles :
              </p>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Droit d&apos;accès</strong> : obtenir une copie des
                    données vous concernant
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Droit de rectification</strong> : faire corriger des
                    données inexactes ou incomplètes
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Droit à l&apos;effacement</strong> : demander la
                    suppression de vos données (droit à l&apos;oubli)
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Droit d&apos;opposition</strong> : vous opposer au
                    traitement de vos données
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Droit à la portabilité</strong> : recevoir vos
                    données dans un format structuré et lisible
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <p>
                    <strong>Droit à la limitation du traitement</strong> :
                    demander la suspension temporaire du traitement de vos
                    données
                  </p>
                </div>
              </div>
              <p>
                Pour exercer l&apos;un de ces droits, adressez votre demande par
                email à{" "}
                <a
                  href="mailto:o.sun.voixanimale@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  o.sun.voixanimale@gmail.com
                </a>
                , en précisant votre nom, prénom et la nature de votre demande.
                Une réponse vous sera apportée dans un délai maximum d&apos;
                <strong>1 mois</strong>.
              </p>
              <p>
                En cas de réponse insatisfaisante ou d&apos;absence de réponse,
                vous avez la possibilité d&apos;introduire une réclamation
                auprès de la{" "}
                <strong>
                  Commission Nationale de l&apos;Informatique et des Libertés
                  (CNIL)
                </strong>{" "}
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

          <section className="bg-green p-6 rounded-lg">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Sécurité des données
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Des mesures techniques et organisationnelles appropriées sont
              mises en œuvre pour protéger vos données contre tout accès non
              autorisé, perte ou divulgation : connexion sécurisée (HTTPS),
              accès aux données restreint aux seules personnes habilitées,
              hébergement sur des infrastructures certifiées. Les données de
              réservation sont accessibles uniquement par O&apos;Sun – Voix
              Animale dans le cadre de la gestion de son activité.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold font-subtitle mb-4 text-center">
              Mise à jour de la politique
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              La présente politique de confidentialité peut être mise à jour à
              tout moment, notamment en cas d&apos;évolution réglementaire ou
              technique. La date de dernière mise à jour est indiquée
              ci-dessous. Nous vous encourageons à la consulter régulièrement.
            </p>
            <p className="text-gray-500 text-xs mt-4 text-center">
              Dernière mise à jour : mai 2026
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
