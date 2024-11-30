"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Invalid login credentials");
    } else {
      // Redirige l'utilisateur après une connexion réussie
      window.location.href = "/admin";
    }
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError("Failed to send reset email. Please check the email provided.");
    } else {
      setMessage(
        "Password reset email sent successfully. Please check your inbox."
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded"
        />
        <button
          type="submit"
          className="bg-dark-green text-white px-4 py-2 rounded-full hover:bg-dark-beige hover:text-black transition duration-300 ease-in-out"
        >
          Me connecter
        </button>
        {error && <p>{error}</p>}
      </form>
      <button
        onClick={handlePasswordReset}
        disabled={!email.trim()}
        className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${
          email.trim()
            ? "text-blue-500 hover:text-blue-700 underline"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Mot de passe oublié ?
      </button>

      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
};

export default LoginForm;
