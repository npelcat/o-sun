import { FormData } from "@/src/hooks/useBookingForm";

interface ClientInfoSectionProps {
  formData: FormData;
  fieldErrors: Record<string, string>;
  emailWarning: string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onBlur: (fieldName: string, value: string) => void;
  inputClass: (fieldName: string) => string;
}

export const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  formData,
  fieldErrors,
  emailWarning,
  onChange,
  onBlur,
  inputClass,
}) => {
  return (
    <fieldset className="border-t pt-6">
      <legend className="text-xl font-subtitle mb-4">Vos informations</legend>

      <div className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block mb-2 font-medium">
            Votre nom et prénom <span className="text-red-500">*</span>
          </label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            value={formData.clientName}
            onChange={onChange}
            onBlur={(e) => onBlur("clientName", e.target.value)}
            required
            className={inputClass("clientName")}
          />
          {fieldErrors.clientName && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.clientName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="clientEmail" className="block mb-2 font-medium">
            Votre email <span className="text-red-500">*</span>
          </label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={onChange}
            onBlur={(e) => onBlur("clientEmail", e.target.value)}
            required
            className={inputClass("clientEmail")}
          />
          {fieldErrors.clientEmail && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.clientEmail}
            </p>
          )}
          {emailWarning && (
            <p className="text-orange-600 text-sm mt-1 font-medium">
              {emailWarning}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="clientPhone" className="block mb-2 font-medium">
            Votre téléphone <span className="text-gray-500">(optionnel)</span>
          </label>
          <input
            id="clientPhone"
            name="clientPhone"
            type="tel"
            value={formData.clientPhone}
            onChange={onChange}
            onBlur={(e) => onBlur("clientPhone", e.target.value)}
            placeholder="Ex: 0601020304 ou +33601020304"
            className={inputClass("clientPhone")}
          />
          {fieldErrors.clientPhone && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.clientPhone}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
};
