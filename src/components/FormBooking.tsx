import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./Button";

const FormBooking: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeSlotId = searchParams.get("timeSlotId");
  const label = searchParams.get("label");

  // Données client
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Données animal et service
  const [animalName, setAnimalName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [service, setService] = useState("");
  const [answers, setAnswers] = useState("");

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
    } catch (error) {
      console.error("Erreur lors de la libération du créneau :", error);
    }
  }, [timeSlotId]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-release after 15 minutes
  useEffect(() => {
    if (!timeSlotId) return;

    timeoutRef.current = setTimeout(
      async () => {
        await releaseSlot();
        alert("Temps écoulé ! Le créneau a été libéré.");
        router.push("/contact/newbooking");
      },
      15 * 60 * 1000
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeSlotId, router, releaseSlot]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Confirmer la réservation
      const confirmResponse = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeSlotId,
          clientName,
          clientEmail,
          clientPhone: clientPhone || null,
          animalName,
          animalType: animalType || null,
          service,
          answers: answers || null,
        }),
      });

      if (!confirmResponse.ok) {
        const error = await confirmResponse.json();
        throw new Error(error.message || "Erreur lors de la réservation");
      }

      const confirmData = await confirmResponse.json();
      const bookingId = confirmData.data?.booking?.id;

      if (!bookingId) {
        throw new Error("ID de réservation non reçu");
      }

      // 2. Envoyer l'email de confirmation
      const emailResponse = await fetch("/api/booking/confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!emailResponse.ok) {
        console.error("Erreur lors de l'envoi de l'email");
        // On ne bloque pas l'utilisateur si l'email échoue
      }

      alert(
        "Réservation réussie ! Vous allez recevoir un email de confirmation."
      );
      router.push("/");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    await releaseSlot();
    alert("Réservation annulée.");
    router.push("/contact/newbooking");
  };

  return (
    <div className="pt-8 px-4 text-justify">
      <h2 className="font-subtitle text-start text-3xl pb-3">
        Réserver le créneau :
      </h2>
      <p className="font-bold py-5">{label}</p>

      <form onSubmit={handleSubmit}>
        {/* Informations client */}
        <div className="py-5">
          <label className="block mb-2">Votre nom et prénom * :</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="py-5">
          <label className="block mb-2">Votre email * :</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="py-5">
          <label className="block mb-2">Votre téléphone (optionnel) :</label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Informations animal */}
        <div className="py-5">
          <label className="block mb-2">Nom de l&apos;animal * :</label>
          <input
            type="text"
            value={animalName}
            onChange={(e) => setAnimalName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="py-5">
          <label className="block mb-2">Type d&apos;animal (optionnel) :</label>
          <input
            type="text"
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
            placeholder="Ex: Chien, Chat, Cheval..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="py-5">
          <label className="block mb-2">Service souhaité * :</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choisissez un service --</option>
            <option value="Communication animale">Communication animale</option>
            <option value="Soin énergétique">Soin énergétique animal</option>
            <option value="Soin énergétique">Soin énergétique humain</option>
            <option value="Communication + Soin">
              Animal : Communication + Soin énergétique
            </option>
          </select>
        </div>

        <div className="py-5">
          <label className="block mb-2">
            Informations supplémentaires (optionnel) :
          </label>
          <textarea
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
            placeholder="Décrivez votre situation, vos questions..."
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button
            titleButton={
              isSubmitting ? "Envoi en cours..." : "Valider la réservation"
            }
            type="submit"
            disabled={isSubmitting}
            className="bg-dark-green p-3 rounded-lg bg-opacity-70 font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-white hover:text-black"
          />

          <Button
            titleButton="Annuler"
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-gray-400 p-3 rounded-lg font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-gray-500"
          />
        </div>
      </form>

      <div className="my-2 font-bold">
        Temps restant : {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>
    </div>
  );
};

export default FormBooking;
