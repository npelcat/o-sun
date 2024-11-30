"use client";

import Image from "next/image";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { GiButterfly } from "react-icons/gi";
import { TextEditor } from "@/src/components/TextEditor";
import { useEffect, useState } from "react";

type ContentSection = {
  id: number;
  page_id: number;
  part: string;
  content: string;
  last_updated: string;
};

const Ethics: React.FC = () => {
  const [content, setContent] = useState<ContentSection[]>([]);

  // Récupérer le contenu de la DB via l'API
  const fetchContent = async () => {
    const response = await fetch("/api/content/2"); //ID de la page souhaitée (cette page ci)
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
      <h2 className="text-3xl font-subtitle font-bold">Mon éthique</h2>

      <div className="flex justify-center bg-beige">
        <div className="flex flex-col gap-6 p-8 w-full md:w-3/5">
          <div>
            <CardTitlePhoto
              title="Ma façon de travailler"
              image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402550/IMG_7142_oybyym.jpg"
              alt="Océane et son cheval Ghost"
            />
            <section className="pt-8 text-justify">
              <div className="flex">
                <span className="text-2xl pr-2">
                  <GiButterfly className="w-6 h-6 mr-2" aria-hidden="true" />
                </span>
                <h3 className="font-subtitle pb-4">
                  Communication animale, énergétique et pathologies
                </h3>
              </div>
              <TextEditor
                initialText={getPartContent("Facon de travailler part 1") || ""}
                part="Facon de travailler part 1"
                onSave={(updatedText) =>
                  handleSave(updatedText, "Facon de travailler part 1", 2)
                }
              />
              <div className="flex">
                <span className="text-2xl pr-2">
                  <GiButterfly className="w-6 h-6 mr-2" aria-hidden="true" />
                </span>
                <h3 className="font-subtitle pb-4">Régler tous les soucis ?</h3>
              </div>
              <TextEditor
                initialText={getPartContent("Facon de travailler part 2") || ""}
                part="Facon de travailler part 2"
                onSave={(updatedText) =>
                  handleSave(updatedText, "Facon de travailler part 2", 2)
                }
              />
              <br />
              <div className="flex">
                <span className="text-2xl pr-2">
                  <GiButterfly className="w-6 h-6 mr-2" aria-hidden="true" />
                </span>
                <h3 className="font-subtitle pb-4">
                  Tenir compte de vous...et de moi
                </h3>
              </div>
              <TextEditor
                initialText={getPartContent("Facon de travailler part 3") || ""}
                part="Facon de travailler part 3"
                onSave={(updatedText) =>
                  handleSave(updatedText, "Facon de travailler part 3", 2)
                }
              />
              <div className="py-8">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <GiButterfly className="w-6 h-6 mr-2" aria-hidden="true" />
                  </span>
                  <h3 className="font-subtitle pb-4">Pour conclure :</h3>
                </div>
                <TextEditor
                  initialText={
                    getPartContent("Facon de travailler part 4") || ""
                  }
                  part="Facon de travailler part 4"
                  onSave={(updatedText) =>
                    handleSave(updatedText, "Facon de travailler part 4", 2)
                  }
                />
                <h3 className="font-subtitle py-4 text-center">
                  Au plaisir d&apos;échanger avec vous et vos animaux !
                </h3>
              </div>

              <div className="flex justify-center py-8">
                <Image
                  className="w-1/2 h-full md:w-1/6 item-center object-cover"
                  loading="lazy"
                  src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720859313/dog-1532627_1920_soflbg.png"
                  alt=""
                  aria-hidden="true"
                  width="1920"
                  height="1180"
                />
              </div>
            </section>
            <div className="bg-dark-beige rounded-lg py-4 px-8 flex flex-col gap-4">
              <h3 className="font-bold bg-white bg-opacity-50 rounded-lg py-4">
                Les détails de ma pratique pour chaque discipline :
              </h3>

              <section className="text-justify">
                <Accordion title="Communication Animale">
                  <TextEditor
                    initialText={
                      getPartContent("Facon de travailler com animale") || ""
                    }
                    part="Facon de travailler com animale"
                    onSave={(updatedText) =>
                      handleSave(
                        updatedText,
                        "Facon de travailler com animale",
                        2
                      )
                    }
                  />
                </Accordion>
                <Accordion title="Soins énergétiques">
                  <TextEditor
                    initialText={
                      getPartContent(
                        "Facon de travailler soins energetiques"
                      ) || ""
                    }
                    part="Facon de travailler soins energetiques"
                    onSave={(updatedText) =>
                      handleSave(
                        updatedText,
                        "Facon de travailler soins energetiques",
                        2
                      )
                    }
                  />
                </Accordion>
                <Accordion title="Pour les gardiens">
                  <TextEditor
                    initialText={
                      getPartContent("Facon de travailler gardiens") || ""
                    }
                    part="Facon de travailler gardiens"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Facon de travailler gardiens", 2)
                    }
                  />
                </Accordion>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          titleButton="Me contacter"
          lien="/contact"
          className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Ethics;
