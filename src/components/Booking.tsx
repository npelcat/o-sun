import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";

interface TimeSlot {
  id: string;
  label: string;
  isActive: boolean;
}

const NewBooking: React.FC = () => {
  const router = useRouter();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [isReserving, setIsReserving] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const fetchSlots = useCallback(async () => {
    try {
      const response = await fetch("/api/booking/timeslots", {
        headers: {
          "Cache-Control": "no-store",
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des créneaux");
      }
      const data = await response.json();

      setTimeSlots(
        data.slots.map((slot: any) => {
          const start = DateTime.fromISO(slot.startTime, {
            zone: "utc",
          }).setZone("Europe/Paris");
          const end = DateTime.fromISO(slot.endTime, { zone: "utc" }).setZone(
            "Europe/Paris"
          );

          const dateStr = start.setLocale("fr").toFormat("cccc d LLLL yyyy");
          const startStr = start.toFormat("HH'h'mm");
          const endStr = end.toFormat("HH'h'mm");

          return {
            id: slot.id,
            label: `${dateStr} ${startStr} - ${endStr}`,
            isActive: slot.isActive,
          };
        })
      );
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

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
      await fetchSlots();
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
      <h2>Choisissez votre créneau</h2>
      <p>Les horaires sont affichés selon l’heure de Paris (CET/CEST)</p>
      <br></br>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {timeSlots.map((slot) => (
          <li key={slot.id} style={{ marginBottom: "0.5rem" }}>
            <button
              onClick={() => handleSelectSlot(slot)}
              disabled={isReserving || !slot.isActive}
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
