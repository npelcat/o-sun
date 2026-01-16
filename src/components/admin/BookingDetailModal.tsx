"use client";

import { useState } from "react";
import { BookingWithDetails } from "@/app/api/types/booking";
import { formatDateTime, formatDateTimeRange } from "@/lib/date";

interface BookingDetailModalProps {
  booking: BookingWithDetails;
  onClose: () => void;
  onStatusChange: (
    id: string,
    status: "pending" | "confirmed" | "canceled"
  ) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Modal affichant tous les détails d'une réservation
 * Permet de modifier le statut, ajouter des notes et supprimer
 */
export default function BookingDetailModal({
  booking,
  onClose,
  onStatusChange,
  onSaveNotes,
  onDelete,
}: BookingDetailModalProps) {
  const [notes, setNotes] = useState(booking.adminNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await onSaveNotes(booking.id, notes);
    setIsSaving(false);
  };

  const handleDelete = () => {
    onDelete(booking.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-beige p-6 border-b border-dark-green/20">
          <div className="flex items-center justify-between">
            <h2 className="font-subtitle text-2xl text-black">
              Détails de la réservation
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
          {/* Informations créneau */}
          <div>
            <h3 className="font-medium text-black mb-3 text-lg">
              📅 Créneau réservé
            </h3>
            <div className="bg-beige p-4 rounded-lg">
              <p className="font-medium text-dark-green">
                {formatDateTimeRange(booking.startTime, booking.endTime)}
              </p>
            </div>
          </div>

          {/* Statut avec actions rapides */}
          <div>
            <h3 className="font-medium text-black mb-3 text-lg">🏷️ Statut</h3>
            <div className="flex space-x-2">
              <StatusButton
                label="En attente"
                isActive={booking.status === "pending"}
                onClick={() => onStatusChange(booking.id, "pending")}
                bgColor="bg-yellow-100 hover:bg-yellow-200"
                activeColor="bg-yellow-300"
              />
              <StatusButton
                label="Confirmée"
                isActive={booking.status === "confirmed"}
                onClick={() => onStatusChange(booking.id, "confirmed")}
                bgColor="bg-green hover:bg-green/80"
                activeColor="bg-dark-green text-white"
              />
              <StatusButton
                label="Annulée"
                isActive={booking.status === "canceled"}
                onClick={() => onStatusChange(booking.id, "canceled")}
                bgColor="bg-red-100 hover:bg-red-200"
                activeColor="bg-red-300"
              />
            </div>
          </div>

          {/* Informations client */}
          <div>
            <h3 className="font-medium text-black mb-3 text-lg">
              👤 Informations client
            </h3>
            <div className="bg-beige p-4 rounded-lg space-y-2 text-sm">
              <InfoRow label="Nom" value={booking.clientName} />
              <InfoRow label="Email" value={booking.clientEmail} />
              <InfoRow
                label="Téléphone"
                value={booking.clientPhone || "Non renseigné"}
              />
            </div>
          </div>

          {/* Informations animal */}
          <div>
            <h3 className="font-medium text-black mb-3 text-lg">
              🐾 Informations animal
            </h3>
            <div className="bg-beige p-4 rounded-lg space-y-2 text-sm">
              <InfoRow label="Nom" value={booking.animalName} />
              <InfoRow
                label="Type"
                value={booking.animalType || "Non renseigné"}
              />
              <InfoRow label="Service demandé" value={booking.service} />
            </div>
          </div>

          {/* Réponses formulaire */}
          {booking.answers && (
            <div>
              <h3 className="font-medium text-black mb-3 text-lg">
                📋 Réponses au formulaire
              </h3>
              <div className="bg-beige p-4 rounded-lg">
                <p className="text-sm text-black whitespace-pre-wrap">
                  {booking.answers}
                </p>
              </div>
            </div>
          )}

          {/* Notes admin */}
          <div>
            <h3 className="font-medium text-black mb-3 text-lg">
              📝 Notes privées (admin uniquement)
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes sur cette réservation (invisibles du client)"
              rows={4}
              className="w-full px-4 py-3 border border-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green resize-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSaving || notes === (booking.adminNotes || "")}
              className="mt-2 px-4 py-2 bg-dark-green text-white rounded-lg hover:bg-dark-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder les notes"}
            </button>
          </div>

          {/* Métadonnées */}
          <div className="text-xs text-black/60 space-y-1">
            <p>Réservation créée le : {formatDateTime(booking.createdAt)}</p>
            <p>Dernière modification : {formatDateTime(booking.updatedAt)}</p>
            <p className="font-mono">ID: {booking.id}</p>
          </div>

          {/* Actions dangereuses */}
          <div className="pt-4 border-t border-beige">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              🗑️ Supprimer cette réservation
            </button>
            <p className="text-xs text-black/60 text-center mt-2">
              Cette action libérera le créneau et ne peut pas être annulée
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les boutons de statut
function StatusButton({
  label,
  isActive,
  onClick,
  bgColor,
  activeColor,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  bgColor: string;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive ? activeColor : bgColor
      }`}
    >
      {label}
    </button>
  );
}

// Composant pour afficher une ligne d'info
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="font-medium text-black min-w-[120px]">{label} :</span>
      <span className="text-black/80">{value}</span>
    </div>
  );
}
