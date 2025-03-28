import { useRouter } from "next/navigation";
import { useState } from "react";

interface TimeSlot {
  id: string;
  label: string;
}

const NewBooking: React.FC = () => {
  const router = useRouter();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [isReserving, setIsReserving] = useState(false);

  const timeSlots: TimeSlot[] = [
    { id: "e7239622-80f5-4954-a173-e60bb59ed624", label: "09:00 - 10:00" },
    { id: "75885356-4fa4-4541-a16e-8704048c3932", label: "10:00 - 11:00" },
    { id: "coucou", label: "11:00 - 12:00" },
  ];

  const handleSelectSlot = async (slot: TimeSlot) => {
    setIsReserving(true);
    try {
      const response = await fetch("/api/booking/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeSlotId: slot.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Créneau non disponible");
      }
      setSelectedTimeSlot(slot);
    } catch (error: any) {
      alert(`Erreur : ${error.message}`);
    } finally {
      setIsReserving(false);
    }
  };

  const handleContinue = () => {
    if (selectedTimeSlot) {
      router.push(
        `/contact/newbooking?timeSlotId=${
          selectedTimeSlot.id
        }&label=${encodeURIComponent(selectedTimeSlot.label)}`
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Choisissez votre créneau</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {timeSlots.map((slot) => (
          <li key={slot.id} style={{ marginBottom: "0.5rem" }}>
            <button
              onClick={() => handleSelectSlot(slot)}
              disabled={isReserving}
            >
              {slot.label}
            </button>
          </li>
        ))}
      </ul>
      {selectedTimeSlot && (
        <div style={{ marginTop: "1rem" }}>
          <p>Créneau sélectionné : {selectedTimeSlot.label}</p>
          <button onClick={handleContinue}>Continuer</button>
        </div>
      )}
    </div>
  );
};

export default NewBooking;
