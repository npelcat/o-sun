"use client";
import { signOut } from "next-auth/react";
import BookingsTable from "../components/BookingTable";
import { BookingWithDetails } from "@/app/api/types/booking";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminDashboardClientProps {
  adminUser: AdminUser;
  bookings: BookingWithDetails[];
}

export default function AdminDashboardClient({
  adminUser,
  bookings,
}: AdminDashboardClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            👋 Bienvenue, {adminUser.username} !
          </h1>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-green-800 mb-2">
              Informations du compte :
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Nom :</strong> {adminUser.username}
              </p>
              <p>
                <strong>Email :</strong> {adminUser.email}
              </p>
              <p>
                <strong>Rôle :</strong> {adminUser.role}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.length}
            </div>
            <div className="text-gray-600">Total réservations</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
            <div className="text-gray-600">Confirmées</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <div className="text-gray-600">En attente</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Réservations</h2>
          <BookingsTable bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
