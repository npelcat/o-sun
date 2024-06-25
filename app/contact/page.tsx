import Contact from "@/src/components/Contact";
import { NextPage } from "next";

const ContactIndex: NextPage = () => {
  return (
    <div className="text-center">
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
        <Contact />
      </main>
    </div>
  );
};

export default ContactIndex;
