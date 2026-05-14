import { FormData } from "@/src/hooks/useBookingForm";

export const SERVICES = [
  {
    value: "Appel découverte 15 minutes",
    label: "Appel découverte 15 minutes",
  },
  {
    value: "Communication animale - Clarté",
    label: "Communication animale - Clarté",
  },
  {
    value: "Communication animale - Équilibre",
    label: "Communication animale - Équilibre",
  },
  {
    value: "Communication animale - Harmonie",
    label: "Communication animale - Harmonie",
  },
  {
    value: "Communication animale - Reconnexion",
    label: "Communication animale - Reconnexion",
  },
  { value: "Soin énergétique animal", label: "Soin énergétique animal" },
  { value: "Soin énergétique humain", label: "Soin énergétique humain" },
  { value: "Soin énergétique DUO", label: "Soin énergétique DUO" },
  { value: "Urgence - formule Clarté", label: "Urgence - formule Clarté" },
  { value: "Urgence - formule Harmonie", label: "Urgence - formule Harmonie" },
  { value: "Urgence - Pack Traversée", label: "Urgence - Pack Traversée" },
] as const;

// Helpers pour classifier les services
const isCommunicationAnimale = (service: string) =>
  service.startsWith("Communication animale");

const isSoinEnergetique = (service: string) =>
  service.startsWith("Soin énergétique");

const isUrgence = (service: string) => service.startsWith("Urgence");

// Nombre de sujets autorisés selon la formule de communication animale
const getSubjectCount = (service: string): number => {
  if (service.includes("Clarté") || service.includes("Reconnexion")) return 1;
  if (service.includes("Équilibre")) return 2;
  if (service.includes("Harmonie")) return 4;
  return 1;
};

// Nombre de sujets autorisés pour les urgences
const getUrgenceSubjectCount = (service: string): number => {
  if (service.includes("Clarté")) return 1;
  if (service.includes("Harmonie") || service.includes("Traversée")) return 3;
  return 1;
};

interface ServiceSpecificFieldsProps {
  formData: FormData;
  fieldErrors: Record<string, string>;
  onServiceSpecificChange: (fieldKey: string, value: string) => void;
  inputClass: (fieldName: string) => string;
}

export const ServiceSpecificFields: React.FC<ServiceSpecificFieldsProps> = ({
  formData,
  fieldErrors,
  onServiceSpecificChange,
  inputClass,
}) => {
  const { service, serviceSpecificAnswers } = formData;

  if (!service || service === "Appel découverte 15 minutes") return null;

  const fieldError = (key: string) =>
    fieldErrors[`serviceSpecificAnswers.${key}`];

  // ── Communication animale ────────────────────────────────────────────────
  if (isCommunicationAnimale(service)) {
    const subjectCount = getSubjectCount(service);

    return (
      <div className="space-y-4">
        {/* Sujets à explorer */}
        {Array.from({ length: subjectCount }, (_, i) => {
          const key = `sujet_${i + 1}`;
          const label =
            subjectCount === 1
              ? "Sujet à explorer avec votre animal"
              : `Sujet ${i + 1} à explorer avec votre animal`;

          return (
            <div key={key}>
              <label htmlFor={key} className="block mb-2 font-medium">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={key}
                type="text"
                value={serviceSpecificAnswers[key] ?? ""}
                onChange={(e) => onServiceSpecificChange(key, e.target.value)}
                className={inputClass(key)}
              />
              {fieldError(key) && (
                <p className="text-red-500 text-sm mt-1">{fieldError(key)}</p>
              )}
            </div>
          );
        })}

        {/* Date butoir */}
        <div>
          <label htmlFor="date_butoir" className="block mb-2 font-medium">
            Y a-t-il une date butoir à respecter pour l&apos;un des sujets ?{" "}
            <span className="text-gray-500">(optionnel)</span>
          </label>
          <input
            id="date_butoir"
            type="text"
            value={serviceSpecificAnswers["date_butoir"] ?? ""}
            onChange={(e) =>
              onServiceSpecificChange("date_butoir", e.target.value)
            }
            placeholder="Ex : avant le 15 mars, avant les vacances..."
            className={inputClass("date_butoir")}
          />
        </div>

        {/* Message de cœur */}
        <div>
          <label htmlFor="message_coeur" className="block mb-2 font-medium">
            Message de cœur à cœur : quel message personnel souhaitez-vous
            transmettre à votre animal ? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message_coeur"
            value={serviceSpecificAnswers["message_coeur"] ?? ""}
            onChange={(e) =>
              onServiceSpecificChange("message_coeur", e.target.value)
            }
            rows={4}
            className={inputClass("message_coeur")}
          />
          {fieldError("message_coeur") && (
            <p className="text-red-500 text-sm mt-1">
              {fieldError("message_coeur")}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Soin énergétique ─────────────────────────────────────────────────────
  if (isSoinEnergetique(service)) {
    const isDUO = service.includes("DUO");
    const isHumain = service.includes("humain") || isDUO;
    const isAnimal = service.includes("animal") || isDUO;

    return (
      <div className="space-y-4">
        {isHumain && (
          <div>
            <label
              htmlFor="soin_infos_humain"
              className="block mb-2 font-medium"
            >
              Informations pertinentes pour le soin vous concernant
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Problèmes physiques ou de santé, émotions difficiles à gérer,
              blocages, situations pesantes...
            </p>
            <textarea
              id="soin_infos_humain"
              value={serviceSpecificAnswers["soin_infos_humain"] ?? ""}
              onChange={(e) =>
                onServiceSpecificChange("soin_infos_humain", e.target.value)
              }
              rows={4}
              className={inputClass("soin_infos_humain")}
            />
          </div>
        )}

        {isAnimal && (
          <div>
            <label
              htmlFor="soin_infos_animal"
              className="block mb-2 font-medium"
            >
              Informations pertinentes pour le soin concernant votre animal
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Problèmes physiques ou de santé, émotions difficiles à gérer,
              blocages, comportements difficiles...
            </p>
            <textarea
              id="soin_infos_animal"
              value={serviceSpecificAnswers["soin_infos_animal"] ?? ""}
              onChange={(e) =>
                onServiceSpecificChange("soin_infos_animal", e.target.value)
              }
              rows={4}
              className={inputClass("soin_infos_animal")}
            />
          </div>
        )}
      </div>
    );
  }

  // ── Urgences ─────────────────────────────────────────────────────────────
  if (isUrgence(service)) {
    const subjectCount = getUrgenceSubjectCount(service);

    return (
      <div className="space-y-4">
        {/* Description de la situation d'urgence */}
        <div>
          <label htmlFor="urgence_situation" className="block mb-2 font-medium">
            Décrivez la situation d&apos;urgence{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="urgence_situation"
            value={serviceSpecificAnswers["urgence_situation"] ?? ""}
            onChange={(e) =>
              onServiceSpecificChange("urgence_situation", e.target.value)
            }
            rows={4}
            className={inputClass("urgence_situation")}
          />
          {fieldError("urgence_situation") && (
            <p className="text-red-500 text-sm mt-1">
              {fieldError("urgence_situation")}
            </p>
          )}
        </div>

        {/* Sujets à aborder */}
        {Array.from({ length: subjectCount }, (_, i) => {
          const key = `urgence_sujet_${i + 1}`;
          const label =
            subjectCount === 1
              ? "Sujet à aborder avec votre animal"
              : `Sujet ${i + 1} à aborder avec votre animal`;

          return (
            <div key={key}>
              <label htmlFor={key} className="block mb-2 font-medium">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={key}
                type="text"
                value={serviceSpecificAnswers[key] ?? ""}
                onChange={(e) => onServiceSpecificChange(key, e.target.value)}
                className={inputClass(key)}
              />
              {fieldError(key) && (
                <p className="text-red-500 text-sm mt-1">{fieldError(key)}</p>
              )}
            </div>
          );
        })}

        {/* Message de cœur */}
        <div>
          <label
            htmlFor="urgence_message_coeur"
            className="block mb-2 font-medium"
          >
            Message de cœur : quel message personnel souhaitez-vous transmettre
            à votre animal ? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="urgence_message_coeur"
            value={serviceSpecificAnswers["urgence_message_coeur"] ?? ""}
            onChange={(e) =>
              onServiceSpecificChange("urgence_message_coeur", e.target.value)
            }
            rows={4}
            className={inputClass("urgence_message_coeur")}
          />
          {fieldError("urgence_message_coeur") && (
            <p className="text-red-500 text-sm mt-1">
              {fieldError("urgence_message_coeur")}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
};
