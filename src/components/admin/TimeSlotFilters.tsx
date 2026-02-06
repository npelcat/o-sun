"use client";

interface TimeslotFiltersProps {
  monthFilter: string;
  isActiveFilter: string;
  onMonthChange: (month: string) => void;
  onIsActiveChange: (isActive: "true" | "false" | "") => void;
  onReset: () => void;
}

export default function TimeslotFilters({
  monthFilter,
  isActiveFilter,
  onMonthChange,
  onIsActiveChange,
  onReset,
}: TimeslotFiltersProps) {
  return (
    <div className="bg-beige rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Filtre statut */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Statut
          </label>
          <select
            value={isActiveFilter}
            onChange={(e) =>
              onIsActiveChange(e.target.value as "true" | "false" | "")
            }
            className="w-full px-3 py-2 border border-dark-green/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dark-green"
          >
            <option value="">Tous</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
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
