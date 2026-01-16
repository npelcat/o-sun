"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { TimerDisplay } from "./booking/TimerDisplay";
import { ClientInfoSection } from "./booking/ClientInfoSection";
import { AnimalInfoSection } from "./booking/AnimalInfoSection";
import { ServiceSection } from "./booking/ServiceSection";
import { useToast } from "../hooks/useToast";
import { useBookingTimer } from "../hooks/useBookingTimer";
import { useBookingForm } from "../hooks/useBookingForm";

const FormBooking: React.FC = () => {
  const searchParams = useSearchParams();
  const { error, success, warning } = useToast();

  const timeSlotId = searchParams.get("timeSlotId");
  const label = searchParams.get("label");
  const expiresAtParam = searchParams.get("expiresAt");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook pour la gestion du timer
  const { timeLeft, isTimeRunningOut, cancelBooking, clearTimer } =
    useBookingTimer({
      timeSlotId,
      expiresAtParam,
      onWarning: warning,
    });

  // Hook pour la gestion du formulaire
  const {
    formData,
    fieldErrors,
    isSubmitting,
    emailWarning,
    turnstileToken,
    setTurnstileToken,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useBookingForm({
    timeSlotId,
    onError: error,
    onSuccess: success,
    onClearTimer: clearTimer,
  });

  // Fonction pour générer les classes des inputs
  const inputClass = (fieldName: string) =>
    `w-full p-2 border-2 rounded focus:ring-2 focus:outline-none transition-colors ${
      fieldErrors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-dark-green"
    }`;

  const handleCancelClick = () => setIsModalOpen(true);

  const handleConfirmCancel = async () => {
    setIsModalOpen(false);
    await cancelBooking();
  };

  return (
    <>
      <div className="pt-8 px-4 max-w-2xl mx-auto">
        <h1 className="font-subtitle text-start text-3xl pb-3">
          Réserver le créneau
        </h1>
        <p className="font-bold py-5">{label}</p>

        <TimerDisplay timeLeft={timeLeft} isTimeRunningOut={isTimeRunningOut} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <ClientInfoSection
            formData={formData}
            fieldErrors={fieldErrors}
            emailWarning={emailWarning}
            onChange={handleChange}
            onBlur={handleBlur}
            inputClass={inputClass}
          />

          <AnimalInfoSection
            formData={formData}
            fieldErrors={fieldErrors}
            onChange={handleChange}
            onBlur={handleBlur}
            inputClass={inputClass}
          />

          <ServiceSection
            formData={formData}
            fieldErrors={fieldErrors}
            onChange={handleChange}
            onBlur={handleBlur}
            inputClass={inputClass}
          />

          <div className="border-t pt-6">
            <label className="block mb-2 font-medium">
              Vérification de sécurité <span className="text-red-500">*</span>
            </label>
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => {
                setTurnstileToken(token);
              }}
              onError={() => {
                setTurnstileToken(null);
                error(
                  "Erreur de vérification de sécurité. Veuillez réessayer."
                );
              }}
              onExpire={() => {
                setTurnstileToken(null);
                warning("La vérification a expiré. Veuillez revalider.");
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              titleButton={
                isSubmitting ? "Envoi en cours..." : "Valider la réservation"
              }
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="bg-dark-green p-3 rounded-lg bg-opacity-70 font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <Button
              titleButton="Annuler"
              type="button"
              onClick={handleCancelClick}
              disabled={isSubmitting}
              className="bg-gray-400 p-3 rounded-lg font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsModalOpen(false)}
        title="Annuler la réservation ?"
        message="Êtes-vous sûr de vouloir annuler cette réservation ? Le créneau sera libéré et vous devrez recommencer le processus."
        confirmText="Oui, annuler"
        cancelText="Non, continuer"
      />
    </>
  );
};

export default FormBooking;
