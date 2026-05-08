import { FormData } from "@/src/hooks/useBookingForm";

interface AnimalInfoSectionProps {
  formData: FormData;
  fieldErrors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onBlur: (fieldName: string, value: string) => void;
  inputClass: (fieldName: string) => string;
}

export const AnimalInfoSection: React.FC<AnimalInfoSectionProps> = ({
  formData,
  fieldErrors,
  onChange,
  onBlur,
  inputClass,
}) => {
  return (
    <fieldset className="border-t pt-6">
      <legend className="text-xl font-subtitle mb-4">
        Informations sur l&apos;animal
      </legend>

      <div className="space-y-4">
        {/* Nom de l'animal */}
        <div>
          <label htmlFor="animalName" className="block mb-2 font-medium">
            Nom de l&apos;animal <span className="text-red-500">*</span>
          </label>
          <input
            id="animalName"
            name="animalName"
            type="text"
            value={formData.animalName}
            onChange={onChange}
            onBlur={(e) => onBlur("animalName", e.target.value)}
            required
            className={inputClass("animalName")}
          />
          {fieldErrors.animalName && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.animalName}
            </p>
          )}
        </div>

        {/* Type d'animal — obligatoire */}
        <div>
          <label htmlFor="animalType" className="block mb-2 font-medium">
            Type d&apos;animal <span className="text-red-500">*</span>
          </label>
          <input
            id="animalType"
            name="animalType"
            type="text"
            value={formData.animalType}
            onChange={onChange}
            onBlur={(e) => onBlur("animalType", e.target.value)}
            placeholder="Ex : Chien, Chat, Cheval..."
            required
            className={inputClass("animalType")}
          />
          {fieldErrors.animalType && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.animalType}
            </p>
          )}
        </div>

        {/* Informations sur l'animal */}
        <div>
          <label htmlFor="animalInfo" className="block mb-2 font-medium">
            Informations sur votre animal
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Âge, race, caractère, contexte de vie, éléments importants à
            savoir...
          </p>
          <textarea
            id="animalInfo"
            name="animalInfo"
            value={formData.animalInfo}
            onChange={onChange}
            rows={3}
            className={inputClass("animalInfo")}
          />
          {fieldErrors.animalInfo && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.animalInfo}
            </p>
          )}
        </div>

        {/* Composition du foyer */}
        <div>
          <label htmlFor="householdInfo" className="block mb-2 font-medium">
            Composition du foyer
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Autres animaux, personnes vivant avec l&apos;animal, environnement
            général...
          </p>
          <textarea
            id="householdInfo"
            name="householdInfo"
            value={formData.householdInfo}
            onChange={onChange}
            rows={3}
            className={inputClass("householdInfo")}
          />
          {fieldErrors.householdInfo && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.householdInfo}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
};
