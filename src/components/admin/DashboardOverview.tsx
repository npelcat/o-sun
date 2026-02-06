"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/src/hooks/useToast";
import { BookingWithDetails } from "@/app/api/types/booking";
import Loader from "@/src/components/Loader";
import { formatDateTime } from "@/lib/date";
import { calculateBookingStats } from "@/lib/admin/stats";
import { BOOKING_PERIOD } from "@/lib/constants";

interface DashboardStats {
  total: number;
  upcoming: number;
  pending: number;
  confirmed: number;
  canceled: number;
}

/**
 * Vue d'ensemble du dashboard avec statistiques
 * Affiche : Total général, Total à venir, + stats par statut (sur réservations à venir)
 */
export default function DashboardOverview() {
  const { error } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingWithDetails[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Récupérer TOUTES les réservations (pour le total)
      const allResponse = await fetch(
        `/api/admin/bookings?period=${BOOKING_PERIOD.ALL}`,
      );
      if (!allResponse.ok) throw new Error("Erreur lors du chargement");
      const allData = await allResponse.json();
      const allBookings = allData.bookings;

      // Récupérer les réservations À VENIR (pour les stats détaillées)
      const upcomingResponse = await fetch(
        `/api/admin/bookings?period=${BOOKING_PERIOD.UPCOMING}`,
      );
      if (!upcomingResponse.ok) throw new Error("Erreur lors du chargement");
      const upcomingData = await upcomingResponse.json();
      const upcomingBookings = upcomingData.bookings;

      // Calculer les stats
      const upcomingStats = calculateBookingStats(upcomingBookings);
      const statsData: DashboardStats = {
        total: allBookings.length,
        upcoming: upcomingBookings.length,
        ...upcomingStats,
      };

      setStats(statsData);
      setRecentBookings(upcomingBookings.slice(0, 10));
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="font-subtitle text-3xl text-black mb-6">
        Tableau de bord
      </h1>

      {/* Statistiques - 5 cases */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total (toutes)"
          value={stats?.total || 0}
          bgColor="bg-beige"
          textColor="text-black"
        />
        <StatCard
          label="À venir"
          value={stats?.upcoming || 0}
          bgColor="bg-blue-100"
          textColor="text-blue-800"
        />
        <StatCard
          label="En attente"
          value={stats?.pending || 0}
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
        />
        <StatCard
          label="Confirmées"
          value={stats?.confirmed || 0}
          bgColor="bg-green"
          textColor="text-dark-green"
        />
        <StatCard
          label="Annulées"
          value={stats?.canceled || 0}
          bgColor="bg-red-100"
          textColor="text-red-800"
        />
      </div>

      {/* Dernières réservations à venir */}
      <div className="bg-white border border-beige rounded-lg p-6">
        <h2 className="font-subtitle text-xl mb-4">Prochaines réservations</h2>
        {recentBookings.length === 0 ? (
          <p className="text-black/60 text-center py-4">
            Aucune réservation à venir
          </p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-beige rounded-lg"
              >
                <div>
                  <p className="font-medium text-black">{booking.clientName}</p>
                  <p className="text-sm text-black/60">
                    {formatDateTime(booking.startTime)}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour les cartes de stats
function StatCard({
  label,
  value,
  bgColor,
  textColor,
}: {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
      <div className="text-black/60 mt-1 text-sm">{label}</div>
    </div>
  );
}

// Badge de statut
function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green text-dark-green",
    canceled: "bg-red-100 text-red-800",
  };

  const labels = {
    pending: "En attente",
    confirmed: "Confirmée",
    canceled: "Annulée",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        styles[status as keyof typeof styles]
      }`}
    >
      {labels[status as keyof typeof labels]}
    </span>
  );
}
