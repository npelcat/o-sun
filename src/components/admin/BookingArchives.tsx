"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/src/hooks/useToast";
import { BookingWithDetails } from "@/app/api/types/booking";
import Loader from "@/src/components/Loader";
import BookingFilters from "./BookingFilters";
import BookingsTable from "./BookingTable";
import BookingDetailModal from "./BookingDetailModal";
import {
  BOOKING_PERIOD,
  BookingStatus,
  BookingStatusFilter,
} from "@/lib/constants";

export default function BookingsArchive() {
  const { error, success } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithDetails | null>(null);

  // Filtres
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("");
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("period", BOOKING_PERIOD.PAST);
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

  const handleStatusChange = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
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

      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(data.booking);
      }
    } catch (err) {
      setBookings(previousBookings);
      error(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette archive ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      success("Archive supprimée !");
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur");
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-subtitle text-3xl text-black">
          Archives des réservations
        </h1>
        <span className="text-sm text-black/60 bg-beige px-3 py-1 rounded-full">
          Réservations passées uniquement
        </span>
      </div>

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
          setMonthFilter("");
          setEmailFilter("");
        }}
      />

      {/* Liste des archives */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-4 text-sm text-black/60">
            {bookings.length} archive{bookings.length > 1 ? "s" : ""} trouvée
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
