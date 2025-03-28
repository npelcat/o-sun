import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch("/api/booking/timeslots");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des créneaux");
        }
        const data = await response.json();

        const formatterDate = new Intl.DateTimeFormat("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const formatterHour = new Intl.DateTimeFormat("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        setTimeSlots(
          data.slots.map((slot: any) => {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);
            const dateStr = formatterDate.format(start);
            const startStr = formatterHour.format(start).replace(":", "h");
            const endStr = formatterHour.format(end).replace(":", "h");

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
    };

    fetchSlots();
  }, []);

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
