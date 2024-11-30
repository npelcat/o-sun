"use client";

import { supabase } from "../utils/supabaseClient";
import { useState } from "react";

const TestEmailSender: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendTestEmail = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setMessage("Sending email...");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Error sending email: ", error.message);
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Password reset email sent successfully!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 rounded border"
      />
      <button
        onClick={sendTestEmail}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Password Reset Email
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TestEmailSender;
