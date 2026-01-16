"use client";

import { BookingWithDetails } from "@/app/api/types/booking";
import { formatDateTime } from "@/lib/date";

interface BookingsTableProps {
  bookings: BookingWithDetails[];
  onViewDetails: (booking: BookingWithDetails) => void;
  onStatusChange: (
    id: string,
    status: "pending" | "confirmed" | "canceled"
  ) => void;
  onDelete: (id: string) => void;
}

/**
 * Tableau des réservations avec actions rapides
 */
export default function BookingsTable({
  bookings,
  onViewDetails,
  onStatusChange,
  onDelete,
}: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-beige rounded-lg">
        <p className="text-black/60">Aucune réservation trouvée</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-beige rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-beige">
          <thead className="bg-beige">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Animal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Date & Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-beige">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-green/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-black">
                    {booking.clientName}
                  </div>
                  <div className="text-sm text-black/60">
                    {booking.clientEmail}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{booking.animalName}</div>
                  <div className="text-sm text-black/60">{booking.service}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {formatDateTime(booking.startTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusSelect
                    currentStatus={booking.status}
                    onChange={(newStatus) =>
                      onStatusChange(booking.id, newStatus)
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(booking)}
                      className="text-dark-green hover:text-dark-green/80 font-medium"
                    >
                      Voir détails
                    </button>
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Select pour changer le statut rapidement
function StatusSelect({
  currentStatus,
  onChange,
}: {
  currentStatus: string;
  onChange: (status: "pending" | "confirmed" | "canceled") => void;
}) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    confirmed: "bg-green text-dark-green border-dark-green/30",
    canceled: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) =>
        onChange(e.target.value as "pending" | "confirmed" | "canceled")
      }
      className={`px-3 py-1 rounded-full text-sm font-medium border-2 focus:outline-none focus:ring-2 focus:ring-dark-green ${
        statusStyles[currentStatus as keyof typeof statusStyles]
      }`}
    >
      <option value="pending">En attente</option>
      <option value="confirmed">Confirmée</option>
      <option value="canceled">Annulée</option>
    </select>
  );
}
