"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "../hooks/useToast";
import { ZodError } from "zod";
import { confirmBookingSchema } from "@/lib/validation/booking";

const SERVICES = [
  { value: "communication", label: "Communication animale" },
  { value: "soin_animal", label: "Soin énergétique animal" },
  { value: "soin_humain", label: "Soin énergétique humain" },
  {
    value: "communication_soin",
    label: "Animal : Communication + Soin énergétique",
  },
] as const;

const FormBooking: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error, success, warning } = useToast();

  const timeSlotId = searchParams.get("timeSlotId");
  const label = searchParams.get("label");
  const expiresAtParam = searchParams.get("expiresAt");

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    animalName: "",
    animalType: "",
    service: "",
    answers: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const releaseSlot = useCallback(async () => {
    if (!timeSlotId) return;
    try {
      await fetch("/api/booking/release-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeSlotId }),
      });
    } catch (err) {
      console.error("Erreur lors de la libération du créneau :", err);
    }
  }, [timeSlotId]);

  // Timer countdown
  useEffect(() => {
    if (!expiresAtParam) return;

    const expiresAt = new Date(expiresAtParam);
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt.getTime() - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAtParam]);

  // Auto-release on timeout
  useEffect(() => {
    if (!expiresAtParam || !timeSlotId) return;

    const expiresAt = new Date(expiresAtParam);
    const timeUntilExpiry = expiresAt.getTime() - Date.now();

    if (timeUntilExpiry <= 0) {
      releaseSlot();
      warning("Le temps est écoulé. Veuillez sélectionner un nouveau créneau.");
      router.push("/contact/newbooking");
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      await releaseSlot();
      warning("Temps écoulé ! Le créneau a été libéré.");
      router.push("/contact/newbooking");
    }, timeUntilExpiry);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [expiresAtParam, timeSlotId, router, releaseSlot, warning]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldName: string, value: string) => {
    // Ne valider que si le champ a une valeur OU si c'est un champ requis
    const requiredFields = [
      "clientName",
      "clientEmail",
      "animalName",
      "service",
    ];

    if (!value.trim() && !requiredFields.includes(fieldName)) {
      return; // Pas de validation pour les champs optionnels vides
    }

    try {
      // Validation du champ spécifique
      const fieldSchema =
        confirmBookingSchema.shape[
          fieldName as keyof typeof confirmBookingSchema.shape
        ];

      if (fieldSchema) {
        // Préparer la valeur selon le champ
        let valueToValidate: string | null = value.trim();
        if (fieldName === "clientEmail") {
          valueToValidate = valueToValidate.toLowerCase();
        }
        if (fieldName === "clientPhone" && !valueToValidate) {
          valueToValidate = null;
        }

        fieldSchema.parse(valueToValidate);

        // Pas d'erreur, on peut supprimer l'erreur existante
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const data = {
      timeSlotId,
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim().toLowerCase(),
      clientPhone: formData.clientPhone.trim() || null,
      animalName: formData.animalName.trim(),
      animalType: formData.animalType.trim() || null,
      service: formData.service,
      answers: formData.answers.trim() || null,
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
        error("Veuillez corriger les erreurs dans le formulaire");
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
          error("Veuillez corriger les erreurs signalées");
        } else {
          throw new Error(
            responseData.message || "Erreur lors de la réservation"
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

      success(
        "Demande de réservation finalisée ! Vous allez recevoir un email de confirmation."
      );

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?"))
      return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    await releaseSlot();
    warning("Réservation annulée.");
    router.push("/contact/newbooking");
  };

  const inputClass = (fieldName: string) =>
    `w-full p-2 border-2 rounded focus:ring-2 focus:outline-none transition-colors ${
      fieldErrors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-dark-green"
    }`;

  const isTimeRunningOut = timeLeft <= 5 * 60 && timeLeft > 0;

  return (
    <div className="pt-8 px-4 max-w-2xl mx-auto">
      <h1 className="font-subtitle text-start text-3xl pb-3">
        Réserver le créneau
      </h1>
      <p className="font-bold py-5">{label}</p>

      <div
        className={`mb-6 p-4 rounded-lg border-2 ${
          isTimeRunningOut
            ? "bg-orange-50 border-orange-400 animate-pulse"
            : "bg-blue-50 border-blue-400"
        }`}
      >
        <p className="font-bold text-center">
          ⏱️ Temps restant : {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>
        {isTimeRunningOut && (
          <p className="text-sm text-orange-700 text-center mt-1">
            ⚠️ Dépêchez-vous, le créneau sera bientôt libéré !
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="border-t pt-6">
          <legend className="text-xl font-subtitle mb-4">
            Vos informations
          </legend>

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
                onChange={handleChange}
                onBlur={(e) => handleBlur("clientName", e.target.value)}
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
                onChange={handleChange}
                onBlur={(e) => handleBlur("clientEmail", e.target.value)}
                required
                className={inputClass("clientEmail")}
              />
              {fieldErrors.clientEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.clientEmail}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="clientPhone" className="block mb-2 font-medium">
                Votre téléphone{" "}
                <span className="text-gray-500">(optionnel)</span>
              </label>
              <input
                id="clientPhone"
                name="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={handleChange}
                onBlur={(e) => handleBlur("clientPhone", e.target.value)}
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

        <fieldset className="border-t pt-6">
          <legend className="text-xl font-subtitle mb-4">
            Informations sur l&apos;animal
          </legend>

          <div className="space-y-4">
            <div>
              <label htmlFor="animalName" className="block mb-2 font-medium">
                Nom de l&apos;animal <span className="text-red-500">*</span>
              </label>
              <input
                id="animalName"
                name="animalName"
                type="text"
                value={formData.animalName}
                onChange={handleChange}
                onBlur={(e) => handleBlur("animalName", e.target.value)}
                required
                className={inputClass("animalName")}
              />
              {fieldErrors.animalName && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.animalName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="animalType" className="block mb-2 font-medium">
                Type d&apos;animal{" "}
                <span className="text-gray-500">(optionnel)</span>
              </label>
              <input
                id="animalType"
                name="animalType"
                type="text"
                value={formData.animalType}
                onChange={handleChange}
                onBlur={(e) => handleBlur("animalType", e.target.value)}
                placeholder="Ex: Chien, Chat, Cheval..."
                className={inputClass("animalType")}
              />
              {fieldErrors.animalType && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.animalType}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t pt-6">
          <legend className="text-xl font-subtitle mb-4">
            Service souhaité
          </legend>

          <div>
            <label htmlFor="service" className="block mb-2 font-medium">
              Choisissez votre service <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={(e) => {
                handleChange(e);
                handleBlur("service", e.target.value);
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
            onChange={handleChange}
            placeholder="Décrivez votre situation, vos questions..."
            rows={4}
            className={inputClass("answers")}
          />
          {fieldErrors.answers && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.answers}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            titleButton={
              isSubmitting ? "Envoi en cours..." : "Valider la réservation"
            }
            type="submit"
            disabled={isSubmitting}
            className="bg-dark-green p-3 rounded-lg bg-opacity-70 font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <Button
            titleButton="Annuler"
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-gray-400 p-3 rounded-lg font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </form>
    </div>
  );
};

export default FormBooking;
