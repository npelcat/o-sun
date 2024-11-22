"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { IoIosArrowDropright } from "react-icons/io";
import { useEffect, useState } from "react";
import { TextEditor } from "@/src/components/TextEditor";

type ContentSection = {
  id: number;
  page_id: number;
  part: string;
  content: string;
  last_updated: string;
};

const Guardians: React.FC = () => {
  const [content, setContent] = useState<ContentSection[]>([]);

  // Récupérer le contenu de la base de données via l'API
  const fetchContent = async () => {
    const response = await fetch("/api/content/6"); //ID de la page souhaitée (cette page ci)
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
      <h2 className="text-3xl font-subtitle font-bold">
        Services aux gardiens
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" flex flex-col gap-6 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="Quels sont-ils ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720967009/tarot-8643585_1920_wjzdf2.png"
            alt="Cartes de tarot dans des mains"
          />
          <TextEditor
            initialText={getPartContent("services gardiens part 1") || ""}
            part="services gardiens part 1"
            onSave={(updatedText) =>
              handleSave(updatedText, "services gardiens part 1", 6)
            }
          />
          <Button
            titleButton="Ma façon de travailler et mon éthique"
            lien="/about/ethics"
            className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className="flex flex-col gap-6 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="A quoi ça sert ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720966614/tarot-5070107_1920_edpr5n.jpg"
            alt="Cartes de tarot disposées sur une table"
          />
          <TextEditor
            initialText={
              getPartContent("services gardiens pourquoi part 1") || ""
            }
            part="services gardiens pourquoi part 1"
            onSave={(updatedText) =>
              handleSave(updatedText, "services gardiens pourquoi part 1", 6)
            }
          />
          <Button
            titleButton="Services en cours de création"
            lien="/contact/booking"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className="flex flex-col gap-6 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720966610/tarot-8834477_1920_xgbuyu.jpg"
            alt="bougies, pommes de pin et cartes face cachée"
          />
          <div>
            <Accordion title="Une séance en pratique">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("seance gardien part 1") || ""}
                    part="seance gardien part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "seance gardien part 1", 6)
                    }
                  />
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("seance gardien part 2") || ""}
                    part="seance gardien part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "seance gardien part 2", 6)
                    }
                  />
                </div>
              </section>
            </Accordion>
            <Accordion title="Types de séance et tarifs">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("prestation gardiens 1") || ""}
                    part="prestation gardien 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation gardiens 1", 6)
                    }
                  />
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("prestation gardiens 2") || ""}
                    part="prestation gardien 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation gardiens 2", 6)
                    }
                  />
                </div>
              </section>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          titleButton="Services en cours de création"
          lien="/contact/booking"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default Guardians;
