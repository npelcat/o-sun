import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

    timeoutRef.current = setTimeout(async () => {
      await releaseSlot();
      alert("Temps écoulé ! Le créneau a été libéré.");
      router.push("/contact/newbooking");
    }, 1 * 60 * 1000); // 15 minutes

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

      await response.json();
      alert("Réservation réussie !");
      router.push("/");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Réserver le créneau : {label}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Contenu (optionnel) :</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Valider la réservation"}
        </button>
      </form>
      <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
        Temps restant : {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>
    </div>
  );
};

export default FormBooking;
