"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import DashboardOverview from "../components/admin/DashboardOverview";
import BookingsManagement from "../components/admin/BookingManagement";
import TimeslotsManagement from "../components/admin/TimeSlotsManagement";
import BookingsArchive from "../components/admin/BookingArchives";

type AdminTab = "dashboard" | "bookings" | "archives" | "timeslots";

/**
 * Composant principal du dashboard admin
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-beige border-r border-dark-green/20 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="font-title text-2xl text-dark-green mb-2">Admin</h1>
          <p className="text-sm text-black/60">Espace de gestion</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-dark-green text-white"
                : "text-black hover:bg-green"
            }`}
          >
            📊 Tableau de bord
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === "bookings"
                ? "bg-dark-green text-white"
                : "text-black hover:bg-green"
            }`}
          >
            📅 Réservations
          </button>
          <button
            onClick={() => setActiveTab("archives")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === "archives"
                ? "bg-dark-green text-white"
                : "text-black hover:bg-green"
            }`}
          >
            📦 Archives
          </button>
          <button
            onClick={() => setActiveTab("timeslots")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === "timeslots"
                ? "bg-dark-green text-white"
                : "text-black hover:bg-green"
            }`}
          >
            🕐 Créneaux
          </button>
        </nav>

        {/* Déconnexion */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full mt-4 px-4 py-3 bg-black/10 hover:bg-black/20 rounded-lg text-black transition-colors text-sm"
        >
          🚪 Se déconnecter
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "dashboard" && <DashboardOverview key="dashboard" />}
        {activeTab === "bookings" && <BookingsManagement key="bookings" />}
        {activeTab === "archives" && <BookingsArchive key="archives" />}
        {activeTab === "timeslots" && <TimeslotsManagement key="timeslots" />}
      </main>
    </div>
  );
}
