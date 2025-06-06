"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmail } from "@/utils/send-email";
import { contactSchema, ContactFormData } from "@/app/api/email/contactSchema";

export default function ContactClient() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  const onSubmit = async (data: ContactFormData) => {
    const result = await sendEmail(data);
    if (result.message) {
      setConfirmationMessage(result.message);
    } else if (result.error) {
      setConfirmationMessage(
        "Erreur lors de l'envoi de l'e-mail. Veuillez réessayer."
      );
    }
    reset();
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
        <div className="flex justify-center">
          <button className="text-xl text-white bg-dark-green font-subtitle rounded-full p-4 transition duration-300 ease-in-out hover:bg-dark-beige hover:text-dark-green">
            Envoyer
          </button>
        </div>
        {confirmationMessage && (
          <p className="mt-10 bg-dark-beige bg-opacity-20 p-2 rounded-lg text-center w-full">
            {confirmationMessage}
          </p>
        )}
      </form>
    </div>
  );
}
