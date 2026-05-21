const offers = [
  {
    label: "CLARTÉ",
    description:
      "Si vous avez un besoin unique : une question précise, une situation ciblée, un check up de son état actuel ou un message important à faire passer à votre animal.",
  },
  {
    label: "ÉQUILIBRE",
    description:
      "Si vous voulez à la fois accueillir son état intérieur actuel et approfondir un ou deux sujets.",
  },
  {
    label: "HARMONIE",
    description:
      "Si vous désirez une vision globale et approfondie de votre animal. Un accompagnement riche et complet.",
  },
  {
    label: "RECONNEXION",
    description:
      "Si votre animal est décédé et que vous ressentez le besoin de vous reconnecter à votre lien.",
  },
  {
    label: "URGENCE & FIN DE VIE",
    description: "Si la situation est pressante.",
  },
];

export function OfferGuide() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-subtitle font-bold text-dark-green mb-2 text-center">
          Quelle offre pour quel besoin ?
        </h2>
        <p className="text-sm text-black/50 text-center mb-10 uppercase tracking-widest">
          Communication animale
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {offers.map((offer) => (
            <div
              key={offer.label}
              className="bg-beige/50 rounded-xl p-5 border border-dark-green/10"
            >
              <p className="text-sm font-semibold text-dark-green mb-1 tracking-wide">
                {offer.label}
              </p>
              <p className="text-sm text-black/70 leading-relaxed">
                {offer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
