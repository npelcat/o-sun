"use client";
import { Accordion } from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { TextEditor } from "@/src/components/TextEditor";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosArrowDropright } from "react-icons/io";

type ContentSection = {
  id: number;
  page_id: number;
  part: string;
  content: string;
  last_updated: string;
};

const AboutIndex: NextPage = () => {
  const [content, setContent] = useState<ContentSection[]>([]);

  // Récupérer le contenu de la base de données via l'API
  const fetchContent = async () => {
    const response = await fetch("/api/content/1"); //ID de la page souhaitée (cette page ci)
    const data = await response.json();
    setContent(data);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Fonction pour récupérer une partie spécifique
  const getPartContent = (partName: string) => {
    if (!Array.isArray(content)) {
      console.error("Content is not an array:", content);
      return null;
    }
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
      <h2 className="text-3xl font-subtitle font-bold">Qui suis-je ?</h2>

      <div className="flex justify-center bg-beige">
        <div className="flex flex-col gap-6 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="Océane, (définition de toi en 3, 4 mots)"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402550/IMG_6825_tdlhcg.jpg"
            alt="Océane souriante assise dans la campagne avec un de ses bergers australien"
          />
          <TextEditor
            initialText={getPartContent("Ton parcours") || ""}
            part="Ton parcours"
            onSave={(updatedText) => handleSave(updatedText, "Ton parcours", 1)}
          />
          <div className="flex justify-center py-8">
            <Image
              className="w-1/2 h-full md:w-1/6 item-center object-cover"
              loading="lazy"
              src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1720856658/fox-7405603_1920_etg9z1.png"
              alt=""
              aria-hidden="true"
              width="1920"
              height="1358"
            />
          </div>
          <p>
            <strong>
              Pour en savoir plus, vous pouvez consulter la partie diplômes et
              formations ci-dessous.
            </strong>
          </p>
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className="flex flex-col gap-6 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="Mes diplômes et formations"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402552/IMG_7198_r1dwqk.jpg"
            alt="Océane et son cheval gris Ghost, dans la forêt"
          />
          <div>
            <Accordion title="Ma formation en communication Animale">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={
                      getPartContent("Formation com animale part 1") || ""
                    }
                    part="Formation com animale part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Formation com animale part 1", 1)
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
                    initialText={
                      getPartContent("Formation com animale part 2") || ""
                    }
                    part="Formation com animale part 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Formation com animale part 2", 1)
                    }
                  />
                </div>
              </section>
            </Accordion>
            <Accordion title="Ma formation en soins énergétiques">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={
                      getPartContent("Formation soins energetiques part 1") ||
                      ""
                    }
                    part="Formation soins energetiques part 1"
                    onSave={(updatedText) =>
                      handleSave(
                        updatedText,
                        "Formation soins energetiques part 1",
                        1
                      )
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
                    initialText={
                      getPartContent("Formation soins energetiques part 2") ||
                      ""
                    }
                    part="Formation soins energetiques part 2"
                    onSave={(updatedText) =>
                      handleSave(
                        updatedText,
                        "Formation soins energetiques part 2",
                        1
                      )
                    }
                  />
                </div>
              </section>
            </Accordion>
            <Accordion title="Ma formation pour les autres services">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={
                      getPartContent("Formation gardiens part 1") || ""
                    }
                    part="Formation gardiens part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Formation gardiens part 1", 1)
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
                    initialText={
                      getPartContent("Formation gardiens part 2") || ""
                    }
                    part="Formation gardiens part 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Formation gardiens part 2", 1)
                    }
                  />
                </div>
              </section>
            </Accordion>
            <Accordion title="Mon ancienne vie">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("Ancienne vie part 1") || ""}
                    part="Ancienne vie part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Ancienne vie part 1", 1)
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
                    initialText={getPartContent("Ancienne vie part 2") || ""}
                    part="Ancienne vie part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Ancienne vie part 2", 1)
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
          titleButton="Réserver un service"
          lien="/contact/booking"
          className="flex justify-center items-center text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default AboutIndex;
