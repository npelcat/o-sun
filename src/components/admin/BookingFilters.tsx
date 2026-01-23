"use client";

interface BookingFiltersProps {
  statusFilter: string;
  monthFilter: string;
  emailFilter: string;
  onStatusChange: (status: string) => void;
  onMonthChange: (month: string) => void;
  onEmailChange: (email: string) => void;
  onReset: () => void;
}

/**
 * Composant de filtrage des réservations
 * Statut, mois et email client
 */
export default function BookingFilters({
  statusFilter,
  monthFilter,
  emailFilter,
  onStatusChange,
  onMonthChange,
  onEmailChange,
  onReset,
}: BookingFiltersProps) {
  return (
    <div className="bg-beige rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtre statut */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-dark-green/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dark-green"
          >
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="canceled">Annulées</option>
          </select>
        </div>

        {/* Filtre mois */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Mois
          </label>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-3 py-2 border border-dark-green/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dark-green"
          />
        </div>

        {/* Filtre email */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Email client
          </label>
          <input
            type="email"
            value={emailFilter}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="email@exemple.com"
            className="w-full px-3 py-2 border border-dark-green/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dark-green"
          />
        </div>

        {/* Bouton reset */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 bg-dark-green text-white rounded-lg hover:bg-dark-green/90 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
