"use client";

import { useState } from "react";
import { Button } from "@/src/components/Button";
import { requestPasswordReset } from "@/lib/actions/password-reset";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // ✨ Appel direct de la Server Action
    const result = await requestPasswordReset(email);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage(result.message || "Email envoyé");
      setEmail("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Mot de passe oublié
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="pb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-dark-green"
              placeholder="votre@email.com"
              required
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
              titleButton={isLoading ? "Envoi..." : "Envoyer le lien"}
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>

        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-sm text-gray-600 hover:text-dark-green underline"
          >
            ← Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}
