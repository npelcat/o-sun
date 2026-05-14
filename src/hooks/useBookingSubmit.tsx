import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { confirmBookingSchema } from "@/lib/validation/booking";
import { FormData } from "./useBookingForm";

interface UseBookingSubmitProps {
  formData: FormData;
  timeSlotId: string | null;
  turnstileToken: string | null;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onClearTimer: () => void;
}

export const useBookingSubmit = ({
  formData,
  timeSlotId,
  turnstileToken,
  setIsSubmitting,
  setFieldErrors,
  onError,
  onSuccess,
  onClearTimer,
}: UseBookingSubmitProps) => {
  const router = useRouter();

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

      // Sérialisation des réponses spécifiques en JSON string pour l'API
      const serviceSpecificAnswersJson =
        Object.keys(formData.serviceSpecificAnswers).length > 0
          ? JSON.stringify(formData.serviceSpecificAnswers)
          : null;

      const data = {
        timeSlotId,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim().toLowerCase(),
        clientPhone: formData.clientPhone.trim() || null,
        animalName: formData.animalName.trim(),
        animalType: formData.animalType.trim(),
        animalInfo: formData.animalInfo.trim() || null,
        householdInfo: formData.householdInfo.trim() || null,
        service: formData.service,
        serviceSpecificAnswers: serviceSpecificAnswersJson,
        answers: formData.answers.trim() || null,
        preferredPronoun: formData.preferredPronoun,
        socialMediaConsent: formData.socialMediaConsent,
        monthlyPlanningAck: formData.monthlyPlanningAck,
        cgvAccepted: formData.cgvAccepted,
        turnstileToken,
      };

      // Validation Zod côté client avant envoi
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
              responseData.message ?? "Erreur lors de la réservation",
            );
          }
          return;
        }

        const bookingId = responseData.data?.booking?.id;
        if (!bookingId) throw new Error("ID de réservation non reçu");

        const emailResponse = await fetch("/api/booking/confirm-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        if (!emailResponse.ok) {
          onSuccess(
            "Demande de réservation finalisée ! L'email de confirmation n'a pas pu être envoyé, contactez-nous si besoin.",
          );
        } else {
          onSuccess(
            "Demande de réservation finalisée ! Vous allez recevoir un email de confirmation.",
          );
        }

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
      setIsSubmitting,
      setFieldErrors,
      onError,
      onSuccess,
      onClearTimer,
      router,
    ],
  );

  return { handleSubmit };
};
