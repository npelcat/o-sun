"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FormBooking: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeSlotId = searchParams.get("timeSlotId");
  const label = searchParams.get("label");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = { timeSlotId, name, email, content };

    try {
      // La route API doit être accessible à l'URL /api/booking
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la réservation");
      }

      await response.json();
      alert("Réservation créée avec succès !");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Erreur : ${error.message}`);
      } else {
        alert("Une erreur inconnue est survenue.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Réserver le créneau {label}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block" }}>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block" }}>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block" }}>Contenu (optionnel) :</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Valider la réservation"}
        </button>
      </form>
    </div>
  );
};

export default FormBooking;
