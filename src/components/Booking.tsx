import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import Loader from "@/src/components/Loader";
import { Button } from "@/src/components/Button";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface GroupedTimeSlot {
  id: string;
  label: string;
  isActive: boolean;
  startTime: Date;
}

const NewBooking: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<GroupedTimeSlot | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [allTimeSlots, setAllTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tous les créneaux disponibles
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
      setAllTimeSlots(data.slots);
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

  // Extraire les dates qui ont au moins un créneau disponible
  const datesWithSlots = allTimeSlots
    .filter((slot) => slot.isActive)
    .map((slot) => parseISO(slot.startTime));

  // Filtrer les créneaux du jour sélectionné
  const slotsForSelectedDate = selectedDate
    ? allTimeSlots
        .filter((slot) => {
          const slotDate = parseISO(slot.startTime);
          return isSameDay(slotDate, selectedDate);
        })
        .map((slot) => {
          const start = parseISO(slot.startTime);
          const end = parseISO(slot.endTime);
          const startStr = format(start, "HH'h'mm");
          const endStr = format(end, "HH'h'mm");

          return {
            id: slot.id,
            label: `${startStr} - ${endStr}`,
            isActive: slot.isActive,
            startTime: start,
          };
        })
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    : [];

  const handleSelectSlot = async (slot: GroupedTimeSlot) => {
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
    if (selectedTimeSlot && selectedDate) {
      const dateStr = format(selectedDate, "EEEE d LLLL yyyy", { locale: fr });
      const fullLabel = `${dateStr} ${selectedTimeSlot.label}`;

      router.push(
        `/contact/newbooking?timeSlotId=${
          selectedTimeSlot.id
        }&label=${encodeURIComponent(fullLabel)}`
      );
    }
  };

  return (
    <div className="pt-8 px-4">
      <h2 className="font-subtitle text-start text-3xl pb-3">
        Choisissez votre créneau
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Les horaires sont affichés selon l&apos;heure de Paris (CET/CEST)
      </p>

      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`grid gap-8 ${selectedDate ? "md:grid-cols-2" : "grid-cols-1 max-w-md mx-auto"}`}
        >
          {/* Calendrier */}
          <div>
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                startMonth={new Date()} // ✅ Définit le mois de départ (aujourd'hui)
                hidden={{ before: new Date() }} // ✅ Cache les jours passés
                disabled={(date) => {
                  // Désactiver les dates passées
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (date < today) return true;
                  // Désactiver les dates sans créneaux
                  return !datesWithSlots.some((d) => isSameDay(d, date));
                }}
                modifiers={{
                  hasSlots: datesWithSlots,
                }}
                modifiersStyles={{
                  hasSlots: {
                    fontWeight: "bold",
                    color: "#2d5016",
                    textDecoration: "underline",
                  },
                }}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Les dates en gras ont des créneaux disponibles
            </p>
          </div>

          {/* Liste des créneaux du jour sélectionné */}
          <div>
            {!selectedDate ? (
              <div className="text-center text-gray-500 mt-8">
                👈 Sélectionnez une date dans le calendrier
              </div>
            ) : slotsForSelectedDate.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                Aucun créneau disponible pour cette date
              </div>
            ) : (
              <>
                <h3 className="font-subtitle text-xl mb-4">
                  Créneaux disponibles le{" "}
                  {format(selectedDate, "d LLLL yyyy", { locale: fr })}
                </h3>
                <ul className="space-y-2">
                  {slotsForSelectedDate.map((slot) => (
                    <li key={slot.id}>
                      <button
                        onClick={() => handleSelectSlot(slot)}
                        disabled={isReserving || !slot.isActive}
                        className={`w-full p-3 rounded-lg border-2 text-left transition ${
                          selectedTimeSlot?.id === slot.id
                            ? "border-dark-green bg-green-50"
                            : "border-gray-300 hover:border-dark-green"
                        } ${
                          !slot.isActive || isReserving
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <span className="font-medium">{slot.label}</span>
                        {selectedTimeSlot?.id === slot.id && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation de sélection */}
      {selectedTimeSlot && selectedDate && (
        <div className="mt-8 p-4 bg-green-50 border-2 border-dark-green rounded-lg">
          <p className="mb-2">
            <strong>Créneau sélectionné :</strong>{" "}
            {format(selectedDate, "EEEE d LLLL yyyy", { locale: fr })} à{" "}
            {selectedTimeSlot.label}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            ⏱️ Le créneau est réservé pendant 15 minutes
          </p>
          <Button
            titleButton="Continuer vers le formulaire"
            onClick={handleContinue}
            className="bg-dark-green p-3 rounded-lg bg-opacity-70 font-subtitle text-xl text-white transition duration-300 ease-in-out hover:bg-white hover:text-black"
          />
        </div>
      )}
    </div>
  );
};

export default NewBooking;
