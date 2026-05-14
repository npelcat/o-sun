import { FormData } from "@/src/hooks/useBookingForm";

interface ConsentSectionProps {
  formData: FormData;
  fieldErrors: Record<string, string>;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export const ConsentSection: React.FC<ConsentSectionProps> = ({
  formData,
  fieldErrors,
  onCheckboxChange,
  onChange,
}) => {
  return (
    <fieldset className="border-t pt-6">
      <legend className="text-xl font-subtitle mb-4">
        Préférences et engagements
      </legend>

      <div className="space-y-6">
        {/* Tutoiement / vouvoiement */}
        <div>
          <p className="block mb-3 font-medium">
            Pour nos échanges, êtes-vous plus à l&apos;aise avec le tutoiement
            ou le vouvoiement ? <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="preferredPronoun"
                value="tutoiement"
                checked={formData.preferredPronoun === "tutoiement"}
                onChange={onChange}
                className="accent-dark-green w-4 h-4"
              />
              <span>Tutoiement</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="preferredPronoun"
                value="vouvoiement"
                checked={formData.preferredPronoun === "vouvoiement"}
                onChange={onChange}
                className="accent-dark-green w-4 h-4"
              />
              <span>Vouvoiement</span>
            </label>
          </div>
          {fieldErrors.preferredPronoun && (
            <p className="text-red-500 text-sm mt-2">
              {fieldErrors.preferredPronoun}
            </p>
          )}
        </div>

        {/* Consentement réseaux sociaux */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="socialMediaConsent"
              checked={formData.socialMediaConsent}
              onChange={onCheckboxChange}
              className="accent-dark-green w-4 h-4 mt-1 shrink-0"
            />
            <span>
              M&apos;autorisez-vous à utiliser sur mes réseaux sociaux une photo
              et d&apos;éventuelles citations de messages que votre animal a
              partagés, sans que rien de personnel vous concernant ne soit
              divulgué ?
            </span>
          </label>
        </div>

        {/* Fonctionnement du planning mensuel */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="monthlyPlanningAck"
              checked={formData.monthlyPlanningAck}
              onChange={onCheckboxChange}
              className="accent-dark-green w-4 h-4 mt-1 shrink-0"
            />
            <span>
              En réservant, vous bloquez une place dans mon planning mensuel
              d&apos;accompagnement. La rencontre ou le soin se fera au cours du
              mois concerné, et non sur un jour ou une heure précis. Vous serez
              contacté(e) par e-mail ou message dès que la rencontre commencera.{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>
          {fieldErrors.monthlyPlanningAck && (
            <p className="text-red-500 text-sm mt-2 ml-7">
              {fieldErrors.monthlyPlanningAck}
            </p>
          )}
        </div>

        {/* CGV */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="cgvAccepted"
              checked={formData.cgvAccepted}
              onChange={onCheckboxChange}
              className="accent-dark-green w-4 h-4 mt-1 shrink-0"
            />
            <span>
              J&apos;accepte les{" "}
              <a
                href="/cgv"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-dark-green transition-colors"
              >
                conditions générales de vente
              </a>{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>
          {fieldErrors.cgvAccepted && (
            <p className="text-red-500 text-sm mt-2 ml-7">
              {fieldErrors.cgvAccepted}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
};
