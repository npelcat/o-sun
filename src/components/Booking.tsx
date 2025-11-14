import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import Loader from "@/src/components/Loader";
import { Button } from "@/src/components/Button";

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
  const [isLoading, setIsLoading] = useState(true);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
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

      type ApiSlot = {
        id: string;
        startTime: string;
        endTime: string;
        isActive: boolean;
      };

      setTimeSlots(
        data.slots.map((slot: ApiSlot) => {
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
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Erreur inattendue";
      alert(message);
    } finally {
      setIsLoading(false);
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erreur inattendue";
      alert(`Erreur : ${message}`);
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
    <div className="pt-8 px-4 text-justify">
      <h2 className="font-subtitle text-start text-3xl pb-3">
        Choisissez votre créneau :
      </h2>
      <p>Les horaires sont affichés selon l’heure de Paris (CET/CEST)</p>
      <br></br>
      {isLoading ? (
        <Loader />
      ) : (
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
      )}
      {selectedTimeSlot && (
        <div style={{ position: "relative", marginTop: "1rem" }}>
          <p>Créneau sélectionné : {selectedTimeSlot.label}</p>
          <p className="py-3 font-bold">
            Le créneau sélectionné est réservé pendant 15 minutes.
          </p>
          <Button
            titleButton={"Continuer"}
            onClick={handleContinue}
            className="bg-dark-green p-3 rounded-lg bg-opacity-70 font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-white hover:text-black"
          />
        </div>
      )}
    </div>
  );
};

export default NewBooking;
