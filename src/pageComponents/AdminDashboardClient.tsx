"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminDashboardClientProps {
  adminUser: AdminUser;
}

export default function AdminDashboardClient({
  adminUser,
}: AdminDashboardClientProps) {
  const router = useRouter();

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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
          <p className="text-gray-600">
            Prochaine étape : affichage des réservations
          </p>
        </div>
      </div>
    </div>
  );
}
