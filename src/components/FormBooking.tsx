import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./Button";

const FormBooking: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeSlotId = searchParams.get("timeSlotId");
  const label = searchParams.get("label");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); //avoid spam
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timeSlotId) return;

    timeoutRef.current = setTimeout(
      async () => {
        await releaseSlot();
        alert("Temps écoulé ! Le créneau a été libéré.");
        router.push("/contact/newbooking");
      },
      1 * 60 * 1000
    ); // 15 minutes

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeSlotId, router, releaseSlot]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeSlotId, name, email, content }),
      });

      if (!response.ok) throw new Error("Erreur lors de la réservation");

      const emailResponse = await fetch("/api/booking/confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeSlotId, name, email, content }),
      });

      if (!emailResponse.ok)
        throw new Error("Erreur lors de l'envoi de l'email");

      await emailResponse.json();
      alert("Réservation réussie et email de confirmation envoyé !");
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
        <div className="py-5">
          <label>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="py-5">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="py-5">
          <label>Contenu (optionnel) :</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
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
