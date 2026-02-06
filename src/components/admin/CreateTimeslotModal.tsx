"use client";

import { useTimeslotForm } from "@/src/hooks/useTimeSlotForm";
import { useState } from "react";

interface CreateTimeslotModalProps {
  onClose: () => void;
  onCreate: (startTime: string, endTime: string) => Promise<void>;
}

export default function CreateTimeslotModal({
  onClose,
  onCreate,
}: CreateTimeslotModalProps) {
  const {
    startDate,
    startTime,
    endDate,
    endTime,
    error,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setError,
    validateAndConvert,
  } = useTimeslotForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await onCreate(validation.startISO!, validation.endISO!);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        {/* Header */}
        <div className="bg-beige p-6 border-b border-dark-green/20">
          <div className="flex items-center justify-between">
            <h2 className="font-subtitle text-2xl text-black">
              Créer un nouveau créneau
            </h2>
            <button
              onClick={onClose}
              className="text-black/60 hover:text-black text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Date et heure de début */}
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

          {/* Date et heure de fin */}
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

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Le créneau sera automatiquement vérifié pour éviter les
              chevauchements
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
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
              {isSubmitting ? "Création..." : "Créer le créneau"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
