"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/src/hooks/useToast";
import { BookingWithDetails } from "@/app/api/types/booking";
import Loader from "@/src/components/Loader";
import { getCurrentMonth } from "@/lib/date";
import BookingFilters from "./BookingFilters";
import BookingsTable from "./BookingTable";
import BookingDetailModal from "./BookingDetailModal";
import {
  BOOKING_PERIOD,
  BookingStatus,
  BookingStatusFilter,
} from "@/lib/constants";

export default function BookingsManagement() {
  const { error, success } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithDetails | null>(null);

  // Filtres
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("");
  const [monthFilter, setMonthFilter] = useState<string>(getCurrentMonth());
  const [emailFilter, setEmailFilter] = useState<string>("");

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Construire les paramètres de query
      const params = new URLSearchParams();
      params.append("period", BOOKING_PERIOD.UPCOMING);
      if (statusFilter) params.append("status", statusFilter);
      if (monthFilter) params.append("month", monthFilter);
      if (emailFilter) params.append("clientEmail", emailFilter);

      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, monthFilter, emailFilter, error]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Changement de statut avec update optimiste
  const handleStatusChange = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
    // Update optimiste : changer le statut immédiatement dans l'UI
    const previousBookings = [...bookings];
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: newStatus } : b,
      ),
    );

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      const data = await response.json();
      success("Statut mis à jour !");

      // Mettre à jour avec le booking complet retourné par l'API
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(data.booking);
      }
    } catch (err) {
      // Rollback en cas d'erreur
      setBookings(previousBookings);
      error(err instanceof Error ? err.message : "Erreur");
    }
  };

  // Suppression d'une réservation
  const handleDelete = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      success("Réservation supprimée !");
      setSelectedBooking(null);
      fetchBookings(); // Recharger la liste
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur");
    }
  };

  // Sauvegarde des notes admin
  const handleSaveNotes = async (bookingId: string, notes: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: notes }),
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      const data = await response.json();
      success("Notes sauvegardées !");

      // Mettre à jour avec le booking complet retourné (avec toutes les infos)
      setBookings(bookings.map((b) => (b.id === bookingId ? data.booking : b)));

      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(data.booking);
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <div>
      <h1 className="font-subtitle text-3xl text-black mb-6">
        Réservations à venir
      </h1>

      {/* Filtres */}
      <BookingFilters
        statusFilter={statusFilter}
        monthFilter={monthFilter}
        emailFilter={emailFilter}
        onStatusChange={setStatusFilter}
        onMonthChange={setMonthFilter}
        onEmailChange={setEmailFilter}
        onReset={() => {
          setStatusFilter("");
          setMonthFilter(getCurrentMonth());
          setEmailFilter("");
        }}
      />

      {/* Liste des réservations */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-4 text-sm text-black/60">
            {bookings.length} réservation{bookings.length > 1 ? "s" : ""}{" "}
            trouvée
            {bookings.length > 1 ? "s" : ""}
          </div>
          <BookingsTable
            bookings={bookings}
            onViewDetails={setSelectedBooking}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Modal de détails */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onSaveNotes={handleSaveNotes}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
