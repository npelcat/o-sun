import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { confirmBookingSchema } from "@/lib/validation/booking";
import { POPULAR_DOMAINS } from "@/lib/validation/email";

interface UseBookingFormProps {
  timeSlotId: string | null;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onClearTimer: () => void;
}

export interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  animalName: string;
  animalType: string;
  service: string;
  answers: string;
}

const initialFormData: FormData = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  animalName: "",
  animalType: "",
  service: "",
  answers: "",
};

export const useBookingForm = ({
  timeSlotId,
  onError,
  onSuccess,
  onClearTimer,
}: UseBookingFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [fieldErrors],
  );

  const handleBlur = useCallback((fieldName: string, value: string) => {
    const requiredFields = [
      "clientName",
      "clientEmail",
      "animalName",
      "service",
    ];

    if (!value.trim() && !requiredFields.includes(fieldName)) {
      return;
    }

    // Email domain warning
    if (fieldName === "clientEmail" && value.trim()) {
      const domain = value.split("@")[1]?.toLowerCase();

      if (domain && !POPULAR_DOMAINS.includes(domain)) {
        setEmailWarning(`⚠️ Vous avez saisi "${domain}". Est-ce correct ?`);
      } else {
        setEmailWarning(null);
      }
    }

    // Field validation
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
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setFieldErrors((prev) => ({
          ...prev,
          [fieldName]: err.issues[0]?.message || "Erreur de validation",
        }));
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setFieldErrors({});

      if (!turnstileToken) {
        onError("Veuillez compléter la vérification de sécurité");
        setIsSubmitting(false);
        return;
      }

      const data = {
        timeSlotId,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim().toLowerCase(),
        clientPhone: formData.clientPhone.trim() || null,
        animalName: formData.animalName.trim(),
        animalType: formData.animalType.trim() || null,
        service: formData.service,
        answers: formData.answers.trim() || null,
        turnstileToken,
      };

      try {
        confirmBookingSchema.parse(data);
      } catch (err) {
        if (err instanceof ZodError) {
          const errors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            errors[issue.path.join(".")] = issue.message;
          });
          setFieldErrors(errors);
          onError("Veuillez corriger les erreurs dans le formulaire");
          setIsSubmitting(false);
          return;
        }
      }

      try {
        const confirmResponse = await fetch("/api/booking/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const responseData = await confirmResponse.json();

        if (!confirmResponse.ok) {
          if (responseData.errors) {
            setFieldErrors(responseData.errors);
            onError("Veuillez corriger les erreurs signalées");
          } else {
            throw new Error(
              responseData.message || "Erreur lors de la réservation",
            );
          }
          return;
        }

        const bookingId = responseData.data?.booking?.id;
        if (!bookingId) throw new Error("ID de réservation non reçu");

        await fetch("/api/booking/confirm-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        onSuccess(
          "Demande de réservation finalisée ! Vous allez recevoir un email de confirmation.",
        );

        onClearTimer();
        setTimeout(() => router.push("/"), 2000);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      timeSlotId,
      turnstileToken,
      onError,
      onSuccess,
      onClearTimer,
      router,
    ],
  );

  return {
    formData,
    fieldErrors,
    isSubmitting,
    emailWarning,
    turnstileToken,
    setTurnstileToken,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
