const offers = [
  {
    label: "CLARTÉ",
    description:
      "Si un événement ou un changement approche et que vous souhaitez y préparer votre animal, lui expliquer ce qui va se passer et accueillir ses ressentis ainsi que ses besoins.",
  },
  {
    label: "ÉQUILIBRE",
    description:
      "Si vous souhaitez savoir comment votre animal se sent dans sa globalité, mieux comprendre son équilibre actuel et accueillir ses besoins du moment, sans avoir de question particulière à lui poser.",
  },
  {
    label: "HARMONIE",
    description:
      "Si vous souhaitez mieux comprendre ce que votre animal vit autour d’une situation, d’un comportement ou d’une problématique, et lui poser les questions qui vous tiennent à cœur.",
  },
  {
    label: "RECONNEXION",
    description:
      "Si votre animal est décédé et que vous ressentez le besoin de lui transmettre un message, d’accueillir ceux qu’il souhaite vous confier, de savoir comment il se sent et de lui poser les questions qui vous tiennent à cœur.",
  },
  {
    label: "URGENCE & FIN DE VIE",
    description:
      "Si votre animal traverse une situation pressante ou une période de fin de vie et que vous souhaitez accueillir son vécu, ses besoins et ses messages afin de l’accompagner avec douceur et justesse.",
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
              className="bg-beige rounded-xl p-5 border border-green"
            >
              <p className="text-sm font-semibold text-dark-green mb-1 tracking-wide">
                {offer.label}
              </p>
              <p className="text-sm text-black leading-relaxed">
                {offer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
