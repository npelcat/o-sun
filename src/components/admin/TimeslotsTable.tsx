"use client";

import { formatDateTimeRange } from "@/lib/date";

export interface Timeslot {
  id: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TimeslotsTableProps {
  timeslots: Timeslot[];
  onViewDetails: (timeslot: Timeslot) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  hasLinkedBooking: (id: string) => boolean;
}

export default function TimeslotsTable({
  timeslots,
  onViewDetails,
  onToggleActive,
  onDelete,
  hasLinkedBooking,
}: TimeslotsTableProps) {
  if (timeslots.length === 0) {
    return (
      <div className="text-center py-12 bg-beige rounded-lg">
        <p className="text-black/60">Aucun créneau trouvé</p>
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
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Réservation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-beige">
            {timeslots.map((timeslot) => {
              const isLinked = hasLinkedBooking(timeslot.id);
              const isLocked = isLinked;

              return (
                <tr
                  key={timeslot.id}
                  className="hover:bg-green/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm text-black">
                      {formatDateTimeRange(
                        timeslot.startTime,
                        timeslot.endTime,
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge isActive={timeslot.isActive} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isLinked ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🔒 Réservé
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Libre
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onViewDetails(timeslot)}
                        className="text-dark-green hover:text-dark-green/80 font-medium"
                      >
                        Voir détails
                      </button>
                      {!isLocked && (
                        <>
                          <button
                            onClick={() =>
                              onToggleActive(timeslot.id, !timeslot.isActive)
                            }
                            className="text-yellow-600 hover:text-yellow-800 font-medium"
                          >
                            {timeslot.isActive ? "Désactiver" : "Activer"}
                          </button>
                          <button
                            onClick={() => onDelete(timeslot.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                      {isLocked && (
                        <span className="text-gray-400 text-xs italic">
                          (verrouillé)
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Badge de statut actif/inactif
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? "bg-green text-dark-green" : "bg-gray-200 text-gray-600"
      }`}
    >
      {isActive ? "Actif" : "Inactif"}
    </span>
  );
}
