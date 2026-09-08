import { useCallback, useState } from "react";
import { ZodError } from "zod";
import { confirmBookingSchema } from "@/lib/validation/booking";
import { POPULAR_DOMAINS } from "@/lib/validation/email";
import { FormData } from "./useBookingForm";

interface UseBookingFieldsProps {
  fieldErrors: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const useBookingFields = ({
  fieldErrors,
  setFormData,
  setFieldErrors,
}: UseBookingFieldsProps) => {
  const [emailWarning, setEmailWarning] = useState<string | null>(null);

  const clearFieldError = useCallback(
    (fieldName: string) => {
      if (fieldErrors[fieldName]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[fieldName];
          return next;
        });
      }
    },
    [fieldErrors, setFieldErrors],
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      clearFieldError(name);
    },
    [setFormData, clearFieldError],
  );

  // Checkboxes read `checked`, not `value`
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      clearFieldError(name);
    },
    [setFormData, clearFieldError],
  );

  // Changing the service resets its service-specific answers
  const handleServiceChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        service: value,
        serviceSpecificAnswers: {},
      }));
      clearFieldError("service");
    },
    [setFormData, clearFieldError],
  );

  const handleServiceSpecificChange = useCallback(
    (fieldKey: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        serviceSpecificAnswers: {
          ...prev.serviceSpecificAnswers,
          [fieldKey]: value,
        },
      }));
      clearFieldError(`serviceSpecificAnswers.${fieldKey}`);
    },
    [setFormData, clearFieldError],
  );

  const handleBlur = useCallback(
    (fieldName: string, value: string) => {
      const requiredFields = [
        "clientName",
        "clientEmail",
        "animalName",
        "animalType",
        "service",
        "preferredPronoun",
      ];

      if (!value.trim() && !requiredFields.includes(fieldName)) return;

      if (fieldName === "clientEmail" && value.trim()) {
        const domain = value.split("@")[1]?.toLowerCase();
        if (domain && !POPULAR_DOMAINS.includes(domain)) {
          setEmailWarning(`⚠️ Vous avez saisi "${domain}". Est-ce correct ?`);
        } else {
          setEmailWarning(null);
        }
      }

      try {
        const fieldSchema =
          confirmBookingSchema.shape[
            fieldName as keyof typeof confirmBookingSchema.shape
          ];

        if (fieldSchema) {
          let valueToValidate: string | null = value.trim();
          if (fieldName === "clientEmail") {
            valueToValidate = valueToValidate.toLowerCase();
          }
          if (fieldName === "clientPhone" && !valueToValidate) {
            valueToValidate = null;
          }

          fieldSchema.parse(valueToValidate);
          setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[fieldName];
            return next;
          });
        }
      } catch (err) {
        if (err instanceof ZodError) {
          setFieldErrors((prev) => ({
            ...prev,
            [fieldName]: err.issues[0]?.message ?? "Erreur de validation",
          }));
        }
      }
    },
    [setFieldErrors],
  );

  return {
    emailWarning,
    handleChange,
    handleCheckboxChange,
    handleServiceChange,
    handleServiceSpecificChange,
    handleBlur,
  };
};
