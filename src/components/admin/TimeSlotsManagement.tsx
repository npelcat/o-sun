"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/src/hooks/useToast";
import Loader from "@/src/components/Loader";
import TimeslotsTable, { Timeslot } from "./TimeslotsTable";
import CreateTimeslotModal from "./CreateTimeslotModal";
import TimeslotDetailModal from "./TimeslotDetailModal";
import TimeslotFilters from "./TimeSlotFilters";
import { getCurrentMonth } from "@/lib/date";
import { BOOKING_PERIOD } from "@/lib/constants";

export default function TimeslotsManagement() {
  const { error, success } = useToast();
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeslot, setSelectedTimeslot] = useState<Timeslot | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtres
  const [monthFilter, setMonthFilter] = useState<string>(getCurrentMonth());
  const [isActiveFilter, setIsActiveFilter] = useState<"true" | "false" | "">(
    "",
  );

  // Map pour savoir quels créneaux ont une réservation
  const [linkedBookings, setLinkedBookings] = useState<Set<string>>(new Set());

  const fetchTimeslots = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (monthFilter) params.append("month", monthFilter);
      if (isActiveFilter) params.append("isActive", isActiveFilter);

      const response = await fetch(`/api/admin/timeslots?${params.toString()}`);
      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setTimeslots(data.timeslots);

      // Récupérer les réservations pour savoir quels créneaux sont liés
      const bookingsResponse = await fetch(
        `/api/admin/bookings?period=${BOOKING_PERIOD.ALL}`,
      );
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const linkedIds = new Set<string>(
          bookingsData.bookings.map(
            (b: { timeSlotId: string }) => b.timeSlotId,
          ),
        );
        setLinkedBookings(linkedIds);
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [monthFilter, isActiveFilter, error]);

  useEffect(() => {
    fetchTimeslots();
  }, [fetchTimeslots]);

  const handleCreate = async (startTime: string, endTime: string) => {
    try {
      const response = await fetch("/api/admin/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de la création");
      }

      success("Créneau créé avec succès !");
      setShowCreateModal(false);
      fetchTimeslots();
    } catch (err) {
      throw err; // Remonter l'erreur au modal
    }
  };

  const handleUpdate = async (
    id: string,
    startTime: string,
    endTime: string,
    isActive: boolean,
  ) => {
    try {
      const response = await fetch(`/api/admin/timeslots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime, isActive }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      const data = await response.json();
      success("Créneau mis à jour !");

      // Mettre à jour la liste
      setTimeslots(timeslots.map((t) => (t.id === id ? data.timeslot : t)));

      // Mettre à jour le créneau sélectionné si c'est celui-ci
      if (selectedTimeslot?.id === id) {
        setSelectedTimeslot(data.timeslot);
      }
    } catch (err) {
      throw err; // Remonter l'erreur au modal
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const previousTimeslots = [...timeslots];
    setTimeslots(timeslots.map((t) => (t.id === id ? { ...t, isActive } : t)));

    try {
      const response = await fetch(`/api/admin/timeslots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      success(`Créneau ${isActive ? "activé" : "désactivé"} !`);
    } catch (err) {
      setTimeslots(previousTimeslots);
      error(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est irréversible.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/timeslots/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      success("Créneau supprimé !");
      setSelectedTimeslot(null);
      fetchTimeslots();
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur");
    }
  };

  const hasLinkedBooking = (timeslotId: string): boolean => {
    return linkedBookings.has(timeslotId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-subtitle text-3xl text-black">
          Gestion des créneaux
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-dark-green text-white rounded-lg hover:bg-dark-green/90 transition-colors font-medium"
        >
          ➕ Créer un créneau
        </button>
      </div>

      {/* Filtres */}
      <TimeslotFilters
        monthFilter={monthFilter}
        isActiveFilter={isActiveFilter}
        onMonthChange={setMonthFilter}
        onIsActiveChange={setIsActiveFilter}
        onReset={() => {
          setMonthFilter(getCurrentMonth());
          setIsActiveFilter("");
        }}
      />

      {/* Liste des créneaux */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-4 text-sm text-black/60">
            {timeslots.length} créneau{timeslots.length > 1 ? "x" : ""} trouvé
            {timeslots.length > 1 ? "s" : ""}
          </div>
          <TimeslotsTable
            timeslots={timeslots}
            onViewDetails={setSelectedTimeslot}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            hasLinkedBooking={hasLinkedBooking}
          />
        </>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <CreateTimeslotModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Modal de détail */}
      {selectedTimeslot && (
        <TimeslotDetailModal
          timeslot={selectedTimeslot}
          onClose={() => setSelectedTimeslot(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          hasLinkedBooking={hasLinkedBooking(selectedTimeslot.id)}
        />
      )}
    </div>
  );
}
