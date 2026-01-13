import { FormData } from "@/src/hooks/useBookingForm";

interface ServiceSectionProps {
  formData: FormData;
  fieldErrors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onBlur: (fieldName: string, value: string) => void;
  inputClass: (fieldName: string) => string;
}

const SERVICES = [
  { value: "communication", label: "Communication animale" },
  { value: "soin_animal", label: "Soin énergétique animal" },
  { value: "soin_humain", label: "Soin énergétique humain" },
  {
    value: "communication_soin",
    label: "Animal : Communication + Soin énergétique",
  },
] as const;

export const ServiceSection: React.FC<ServiceSectionProps> = ({
  formData,
  fieldErrors,
  onChange,
  onBlur,
  inputClass,
}) => {
  return (
    <>
      <fieldset className="border-t pt-6">
        <legend className="text-xl font-subtitle mb-4">Service souhaité</legend>

        <div>
          <label htmlFor="service" className="block mb-2 font-medium">
            Choisissez votre service <span className="text-red-500">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={(e) => {
              onChange(e);
              onBlur("service", e.target.value);
            }}
            required
            className={inputClass("service")}
          >
            <option value="">-- Choisissez un service --</option>
            {SERVICES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {fieldErrors.service && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.service}</p>
          )}
        </div>
      </fieldset>

      <div className="border-t pt-6">
        <label htmlFor="answers" className="block mb-2 font-medium">
          Informations supplémentaires{" "}
          <span className="text-gray-500">(optionnel)</span>
        </label>
        <textarea
          id="answers"
          name="answers"
          value={formData.answers}
          onChange={onChange}
          placeholder="Décrivez votre situation, vos questions..."
          rows={4}
          className={inputClass("answers")}
        />
        {fieldErrors.answers && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.answers}</p>
        )}
      </div>
    </>
  );
};
