import Contact from "@/src/components/Contact";
import { NextPage } from "next";

const ContactIndex: NextPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-beige mt-24 py-10">
      <main className="flex flex-col items-center justify-center w-5/6 p-6 bg-white  rounded-lg">
        <h2 className="text-3xl text-center p-4 font-subtitle font-bold">
          Formulaire de contact
        </h2>
        <p className="text-center pb-10 px-4">
          Une question, une demande d&apos;information, une urgence ? <br />
          Contactez-moi via ce formulaire et je vous répondrai dans les
          meilleurs délais.
        </p>
        <Contact />
      </main>
    </div>
  );
};

export default ContactIndex;
