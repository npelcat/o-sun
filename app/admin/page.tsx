"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Tableau de bord Admin - Authentification réussie !
          </h1>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-green-800 mb-2">
              Informations de session :
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>ID :</strong> {session.user?.id}
              </p>
              <p>
                <strong>Nom :</strong> {session.user?.name}
              </p>
              <p>
                <strong>Email :</strong> {session.user?.email}
              </p>
              <p>
                <strong>Image :</strong> {session.user?.image || "Aucune"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                ✅ Test Login Email/Password
              </h3>
              <p className="text-sm text-blue-700">
                Si tu vois cette page après t&apos;être connecté avec
                email/password, le provider Credentials fonctionne !
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">
                ✅ Test Login Google
              </h3>
              <p className="text-sm text-purple-700">
                Si tu vois cette page après t&apos;être connecté avec Google, le
                provider Google fonctionne !
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>

            <button
              onClick={() => router.push("/login")}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Retour au login (test)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Prochaines étapes :</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Créer les vraies pages d&apos;administration</li>
            <li>• Ajouter la gestion des réservations</li>
            <li>• Implémenter les middlewares de protection</li>
            <li>• Tester en production sur Vercel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
