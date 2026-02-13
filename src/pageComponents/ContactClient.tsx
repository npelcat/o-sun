"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { contactSchema, ContactFormData } from "@/lib/validation/contact";
import { sendEmail } from "@/lib/email/send-email";

export default function ContactClient() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  );
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    if (!turnstileToken) {
      setConfirmationMessage("Veuillez compléter la vérification de sécurité.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendEmail(data);

      if (result.message) {
        setConfirmationMessage(result.message);
        reset();
        setTurnstileToken(null);
      } else {
        setConfirmationMessage(
          "Erreur lors de l'envoi de l'e-mail. Veuillez réessayer.",
        );
      }
    } catch {
      setConfirmationMessage(
        "Erreur lors de l'envoi de l'e-mail. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-4/5 lg:w-3/5"
      >
        <div className="mb-5">
          <label htmlFor="name" className="mb-3 block font-bold">
            Votre nom
          </label>
          <input
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-md border border-gray-400 bg-white p-3 outline-none focus:border-dark-green focus:shadow-md"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="mb-3 block font-bold">
            Votre adresse e-mail
          </label>
          <input
            type="email"
            placeholder="exemple@domaine.com"
            className="w-full rounded-md border border-gray-400 bg-white p-3 outline-none focus:border-dark-green focus:shadow-md"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="message" className="mb-3 block font-bold">
            Votre message
          </label>
          <textarea
            rows={4}
            placeholder="Écrivez ici votre message"
            className="w-full resize-none rounded-md border border-gray-400 bg-white p-3 outline-none focus:border-dark-green focus:shadow-md"
            {...register("message")}
          ></textarea>
          {errors.message && (
            <p className="text-red-500">{errors.message.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-3 font-bold">
            Vérification de sécurité <span className="text-red-500">*</span>
          </label>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => {
              setTurnstileToken(token);
              setValue("turnstileToken", token);
            }}
            onError={() => {
              setTurnstileToken(null);
              setValue("turnstileToken", "");
              setConfirmationMessage(
                "Erreur de vérification de sécurité. Veuillez réessayer.",
              );
            }}
            onExpire={() => {
              setTurnstileToken(null);
              setValue("turnstileToken", "");
              setConfirmationMessage(
                "La vérification a expiré. Veuillez revalider.",
              );
            }}
          />
          {errors.turnstileToken && (
            <p className="text-red-500">{errors.turnstileToken.message}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || !turnstileToken}
            className="text-xl text-white bg-dark-green font-subtitle rounded-full p-4 transition duration-300 ease-in-out hover:bg-green hover:text-dark-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </button>
        </div>

        {confirmationMessage && (
          <p
            className={`mt-10 p-2 rounded-lg text-center w-full ${
              confirmationMessage.includes("Erreur")
                ? "bg-red-100 text-red-700"
                : "bg-green bg-opacity-20"
            }`}
          >
            {confirmationMessage}
          </p>
        )}
      </form>
    </div>
  );
}
