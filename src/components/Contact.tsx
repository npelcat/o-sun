"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { sendEmail } from "@/utils/send-email";

export type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact: FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  const onSubmit = async (data: FormData) => {
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-3 block text-base font-medium text-black"
          >
            Ton nom
          </label>
          <input
            type="text"
            placeholder="Nom Prénom"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-dark-green focus:shadow-md"
            {...register("name", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="mb-3 block text-base font-medium text-black"
          >
            Ton adresse e-mail
          </label>
          <input
            type="email"
            placeholder="example@domain.com"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-dark-green focus:shadow-md"
            {...register("email", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="message"
            className="mb-3 block text-base font-medium text-black"
          >
            Message
          </label>
          <textarea
            rows={4}
            placeholder="Ecris ton message"
            className="w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-dark-green focus:shadow-md"
            {...register("message", { required: true })}
          ></textarea>
        </div>
        <div>
          <button className="hover:shadow-form rounded-md bg-dark-green py-3 px-8 text-base font-semibold text-white outline-none">
            Envoyer
          </button>
        </div>
      </form>
      {confirmationMessage && (
        <p className="mt-10 text-black bg-dark-beige bg-opacity-20 p-2 rounded-lg">
          {confirmationMessage}
        </p>
      )}
    </div>
  );
};

export default Contact;
