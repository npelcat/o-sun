"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/date";
import { Timeslot } from "./TimeslotsTable";
import { useTimeslotForm } from "@/src/hooks/useTimeSlotForm";

interface TimeslotDetailModalProps {
  timeslot: Timeslot;
  onClose: () => void;
  onUpdate: (
    id: string,
    startTime: string,
    endTime: string,
    isActive: boolean,
  ) => Promise<void>;
  onDelete: (id: string) => void;
  hasLinkedBooking: boolean;
}

export default function TimeslotDetailModal({
  timeslot,
  onClose,
  onUpdate,
  onDelete,
  hasLinkedBooking,
}: TimeslotDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    startDate,
    startTime,
    endDate,
    endTime,
    isActive,
    error,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setIsActive,
    setError,
    validateAndConvert,
  } = useTimeslotForm({
    initialStartTime: timeslot.startTime,
    initialEndTime: timeslot.endTime,
    initialIsActive: timeslot.isActive,
  });

  const isLocked = hasLinkedBooking;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = validateAndConvert();
    if (!validation.isValid) {
      setError(validation.error || "Erreur de validation");
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdate(
        timeslot.id,
        validation.startISO!,
        validation.endISO!,
        isActive,
      );
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    onDelete(timeslot.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-beige p-6 border-b border-dark-green/20">
          <div className="flex items-center justify-between">
            <h2 className="font-subtitle text-2xl text-black">
              Détails du créneau
            </h2>
            <button
              onClick={onClose}
              className="text-black/60 hover:text-black text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Avertissement si réservé */}
          {isLocked && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">
                🔒 Ce créneau est réservé et ne peut pas être modifié ou
                supprimé. Vous devez d&apos;abord gérer la réservation associée.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!isEditing ? (
            /* Mode lecture */
            <>
              <div>
                <h3 className="font-medium text-black mb-3 text-lg">
                  📅 Période
                </h3>
                <div className="bg-beige p-4 rounded-lg space-y-2">
                  <div className="flex">
                    <span className="font-medium text-black min-w-[120px]">
                      Début :
                    </span>
                    <span className="text-black/80">
                      {formatDateTime(timeslot.startTime)}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-black min-w-[120px]">
                      Fin :
                    </span>
                    <span className="text-black/80">
                      {formatDateTime(timeslot.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-black mb-3 text-lg">
                  🏷️ Statut
                </h3>
                <div className="bg-beige p-4 rounded-lg">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      timeslot.isActive
                        ? "bg-green text-dark-green"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {timeslot.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-black/60 space-y-1">
                <p>Créé le : {formatDateTime(timeslot.createdAt)}</p>
                <p>
                  Dernière modification : {formatDateTime(timeslot.updatedAt)}
                </p>
                <p className="font-mono">ID: {timeslot.id}</p>
              </div>

              {!isLocked && (
                <div className="flex space-x-3 pt-4 border-t border-beige">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-3 bg-dark-green text-white rounded-lg hover:bg-dark-green/90 transition-colors font-medium"
                  >
                    ✏️ Modifier ce créneau
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Mode édition */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Début du créneau
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                    required
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-3 py-2 border border-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Fin du créneau
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                    required
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-3 py-2 border border-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Statut
                </label>
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full px-3 py-2 border border-dark-green/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dark-green"
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                  }}
                  className="flex-1 px-4 py-3 border border-dark-green/20 rounded-lg hover:bg-beige transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-dark-green text-white rounded-lg hover:bg-dark-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
