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
    <div className="flex justify-center w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-4/5 lg:w-3/5"
      >
        <div className="mb-5">
          <label htmlFor="name" className="mb-3 block font-bold">
            Ton nom
          </label>
          <input
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-md border border-gray-300 bg-white p-3 outline-none focus:border-dark-green focus:shadow-md"
            {...register("name", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="mb-3 block font-bold">
            Ton adresse e-mail
          </label>
          <input
            type="email"
            placeholder="exemple@domaine.com"
            className="w-full rounded-md border border-gray-300 bg-white p-3 outline-none focus:border-dark-green focus:shadow-md"
            {...register("email", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="message" className="mb-3 block font-bold">
            Ton message
          </label>
          <textarea
            rows={4}
            placeholder="Ecris ici ton message"
            className="w-full resize-none rounded-md border border-gray-300 bg-white p-3 outline-none focus:border-dark-green focus:shadow-md"
            {...register("message", { required: true })}
          ></textarea>
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
};

export default Contact;
