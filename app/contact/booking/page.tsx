"use client";

import Image from "next/image";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { GiFeather } from "react-icons/gi";
import { LiaFeatherAltSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import { TextEditor } from "@/src/components/TextEditor";

type ContentSection = {
  id: number;
  page_id: number;
  part: string;
  content: string;
  last_updated: string;
};

const Booking: React.FC = () => {
  const [content, setContent] = useState<ContentSection[]>([]);

  // Récupérer le contenu de la base de données via l'API
  const fetchContent = async () => {
    const response = await fetch("/api/content/7"); //ID de la page souhaitée (cette page ci)
    const data = await response.json();
    setContent(data);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Fonction pour récupérer une partie spécifique
  const getPartContent = (partName: string) => {
    return content.find((section) => section.part === partName)?.content;
  };

  // Fonction pour sauvegarder les modifications
  const handleSave = async (
    updatedText: string,
    part: string,
    page_id: number
  ) => {
    try {
      const response = await fetch(`/api/content/${page_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id,
          part,
          content: updatedText,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde du contenu");
      }

      // Mettre à jour localement le state après une sauvegarde réussie
      setContent((prevContent) =>
        prevContent.map((section) =>
          section.part === part ? { ...section, content: updatedText } : section
        )
      );
      alert("Contenu sauvegardé avec succès !");
    } catch (error) {
      alert("Erreur lors de la sauvegarde : vérifiez votre connexion.");
      console.error("Erreur : ", error);
    }
  };

  return (
    <div className="text-center pt-16 space-y-12">
      <h2 className="text-3xl font-subtitle font-bold">Réservations</h2>
      <div className="flex justify-center bg-beige">
        <div className="flex flex-col gap-6 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="Pour réserver un service"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402547/DSC03712_nveqsy.jpg"
            alt="Océane de dos, en face de son cheval gris Ghost"
          />
          <TextEditor
            initialText={getPartContent("resa service part 1") || ""}
            part="resa service part 1"
            onSave={(updatedText) =>
              handleSave(updatedText, "resa service part 1", 7)
            }
          />
          <span className="flex justify-center">
            <LiaFeatherAltSolid aria-hidden="true" />
          </span>
          <TextEditor
            initialText={getPartContent("resa service part 2") || ""}
            part="resa service part 2"
            onSave={(updatedText) =>
              handleSave(updatedText, "resa service part 2", 7)
            }
          />
          <span className="flex justify-center">
            <LiaFeatherAltSolid aria-hidden="true" />
          </span>
          <TextEditor
            initialText={getPartContent("resa service part 3") || ""}
            part="resa service part 3"
            onSave={(updatedText) =>
              handleSave(updatedText, "resa service part 3", 7)
            }
          />
          <span className="flex justify-center">
            <LiaFeatherAltSolid aria-hidden="true" />
          </span>
          <TextEditor
            initialText={getPartContent("resa service part 4") || ""}
            part="resa service part 4"
            onSave={(updatedText) =>
              handleSave(updatedText, "resa service part 4", 7)
            }
          />

          <div className="bg-dark-beige rounded-lg py-4 px-8 flex flex-col gap-4">
            <h3 className="font-bold bg-white bg-opacity-50 rounded-lg py-4">
              Les réservations par services :
            </h3>
            <div className="flex flex-col gap-6 items-center">
              <Button
                titleButton="Réserver une communication animale"
                lien="https://form.jotform.com/232924829211052"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-4 text-xl text-white bg-dark-green font-subtitle rounded-full text-center transition duration-300 ease-in-out hover:bg-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
              />
              <GiFeather aria-hidden="true" />
              <Button
                titleButton="Réserver une séance énergétique"
                lien="https://form.jotform.com/233515437828361"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
              />
              <GiFeather aria-hidden="true" />
              <Button
                titleButton="Réserver un service pour moi (gardien)"
                lien="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
              />
              <p>
                <i>Service en cours de création</i>
              </p>
              <GiFeather aria-hidden="true" />
              <Button
                titleButton="Réserver un Pack"
                lien="https://form.jotform.com/232924829211052"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
              />
            </div>
          </div>
          <div className="flex justify-center py-8">
            <Image
              className="w-1/2 h-full md:w-1/6 item-center object-cover"
              loading="lazy"
              src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720961702/animal-2026667_1920_nvpmjw.png"
              alt=""
              aria-hidden="true"
              width="1920"
              height="1686"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          titleButton="Une question ? > Me contacter"
          lien="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center m-4 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Booking;
