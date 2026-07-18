const benefits = [
  "Apaisement émotionnel",
  "Rééquilibrage énergétique",
  "Soutien physique",
  "Libération de mémoires et traumatismes",
  "Transitions de vie",
  "Prévention et maintien du bien-être",
];

export function EnergyBenefits() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-black leading-relaxed mb-10">
          Le rôle du soin énergétique est d&apos;aider à ré-harmoniser le flux
          d&apos;énergie, à libérer ce qui est resté « coincé », et de ramener
          plus de fluidité, d&apos;harmonie et d&apos;apaisement.
        </p>

        <h2 className="text-xl md:text-2xl font-subtitle font-bold text-dark-green mb-6">
          Un soutien global pour le corps, l&apos;esprit et l&apos;âme
        </h2>

        <ul className="grid gap-3 sm:grid-cols-2 text-left">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-2 text-black bg-beige rounded-xl px-4 py-3"
            >
              <span className="text-dark-green">⋆</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
