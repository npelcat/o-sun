"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/Button";
import { resetPassword } from "@/lib/actions/password-reset";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 10) {
      setError("Le mot de passe doit contenir au moins 10 caractères");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    const result = await resetPassword(token!, password);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setMessage(result.message || "Mot de passe réinitialisé !");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Lien invalide
          </h1>
          <p className="text-gray-600 mb-6">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <a
            href="/forgot-password"
            className="text-dark-green hover:underline"
          >
            Demander un nouveau lien
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Choisissez un mot de passe sécurisé (minimum 10 caractères)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="pb-1 block">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-dark-green"
              required
              minLength={10}
            />
          </div>

          <div>
            <label className="pb-1 block">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-dark-green"
              required
              minLength={10}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
              {message}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              titleButton={isLoading ? "Réinitialisation..." : "Réinitialiser"}
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
