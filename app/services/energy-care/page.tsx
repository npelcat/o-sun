"use client";

import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { GiUbisoftSun } from "react-icons/gi";
import { IoIosArrowDropright } from "react-icons/io";
import { PiHandHeartLight } from "react-icons/pi";
import { GiFallingLeaf } from "react-icons/gi";
import { HiOutlineBellAlert } from "react-icons/hi2";
import Link from "next/link";
import ActOnWhat from "@/src/content/services/energy-care/act-on-what.mdx";
import { TextEditor } from "@/src/components/TextEditor";
import { useEffect, useState } from "react";

type ContentSection = {
  id: number;
  page_id: number;
  part: string;
  content: string;
  last_updated: string;
};

const EnergyCare: React.FC = () => {
  const [content, setContent] = useState<ContentSection[]>([]);

  // Récupérer le contenu de la base de données via l'API
  const fetchContent = async () => {
    const response = await fetch("/api/content/5"); //ID de la page souhaitée (cette page ci)
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
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Les soins énergétiques
      </h2>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5 px-4">
          <CardTitlePhoto
            title="Qu'est-ce que c'est ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402548/IMG_7523_hrovuj.jpg"
            alt="Océane et son cheval gris Ghost, les mains posées autour de son encolure"
          />
          <section className="pt-8 text-center">
            <span className="flex justify-center my-4">
              <GiUbisoftSun aria-hidden="true" />
            </span>
            <TextEditor
              initialText={getPartContent("energetique explication 1") || ""}
              part="energetique explication 1"
              onSave={(updatedText) =>
                handleSave(updatedText, "energetique explication 1", 5)
              }
            />
            <span className="flex justify-center my-4">
              <GiUbisoftSun aria-hidden="true" />
            </span>
            <TextEditor
              initialText={getPartContent("energetique explication 2") || ""}
              part="energetique explication 2"
              onSave={(updatedText) =>
                handleSave(updatedText, "energetique explication 2", 5)
              }
            />
            <span className="flex justify-center my-4">
              <GiUbisoftSun aria-hidden="true" />
            </span>
            <TextEditor
              initialText={getPartContent("energetique explication 3") || ""}
              part="energetique explication 3"
              onSave={(updatedText) =>
                handleSave(updatedText, "energetique explication 3", 5)
              }
            />
          </section>

          <Button
            titleButton="Ma façon de travailler et mon éthique"
            lien="/about/ethics"
            className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Quels sont les effets d'une séance énergétique ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402551/IMG_6874_rrkiyv.jpg"
            alt="Océane et un de ses bergers australien en face à face, la tête penchée"
          />
          <section className="pt-8 text-center">
            <TextEditor
              initialText={getPartContent("effets energetique 1") || ""}
              part="effets energetique 1"
              onSave={(updatedText) =>
                handleSave(updatedText, "effets energetique 1", 5)
              }
            />
            <span className="flex justify-center my-4">
              <GiUbisoftSun aria-hidden="true" />
            </span>
            <TextEditor
              initialText={getPartContent("effets energetique 2") || ""}
              part="effets energetique 2"
              onSave={(updatedText) =>
                handleSave(updatedText, "effets energetique 2", 5)
              }
            />
            <span className="flex justify-center my-4">
              <GiUbisoftSun aria-hidden="true" />
            </span>
            <TextEditor
              initialText={getPartContent("effets energetique 3") || ""}
              part="effets energetique 3"
              onSave={(updatedText) =>
                handleSave(updatedText, "effets energetique 3", 5)
              }
            />
          </section>
          <Button
            titleButton="Réserver un soin énergétique"
            lien="https://form.jotform.com/233515437828361"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-center bg-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Sur quoi agit une séance énergétique ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402554/IMG_7583_ky7o2f.jpg"
            alt="Océane et son cheval gris Ghost, avec un coucher de soleil derrière eux"
          />
          <ActOnWhat />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402552/IMG_7047_tmezot.jpg"
            alt="Tête d'un berger australien tricolore"
          />
          <div>
            <Accordion title="A qui s'adresse mes soins énergétiques ?">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={
                      getPartContent("energetique pour qui part 1") || ""
                    }
                    part="energetique pour qui part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "energetique pour qui part 1", 5)
                    }
                  />
                </div>
              </section>
            </Accordion>
            <Accordion title="Une séance en pratique">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("energetique pratique 1") || ""}
                    part="energetique pratique 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "energetique pratique 1", 5)
                    }
                  />
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("energetique pratique 2") || ""}
                    part="energetique pratique 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "energetique pratique 2", 5)
                    }
                  />
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={getPartContent("energetique pratique 3") || ""}
                    part="energetique pratique 3"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "energetique pratique 3", 5)
                    }
                  />
                </div>
              </section>
            </Accordion>
            <Accordion title="Types de séance et tarifs">
              <section className="text-justify">
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf
                        className="w-6 h-6 mr-2"
                        aria-hidden="true"
                      />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Les séances énergétiques animales – 50€
                    </h3>
                  </div>
                  <TextEditor
                    initialText={
                      getPartContent("prestation energetique 1") || ""
                    }
                    part="prestation energetique 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation energetique 1", 5)
                    }
                  />
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <PiHandHeartLight
                        className="w-6 h-6 mr-2"
                        aria-hidden="true"
                      />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Pack Accompagnement Profondeur – 115€
                    </h3>
                  </div>
                  <TextEditor
                    initialText={
                      getPartContent("prestation energetique 2") || ""
                    }
                    part="prestation energetique 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation energetique 2", 5)
                    }
                  />
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <HiOutlineBellAlert
                        className="w-6 h-6 mr-2"
                        aria-hidden="true"
                      />
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Les Urgences ~ + 15€ au prix initial de la prestation
                      demandée
                    </h3>
                  </div>
                  <TextEditor
                    initialText={
                      getPartContent("prestation energetique 3") || ""
                    }
                    part="prestation energetique 3"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation energetique 3", 5)
                    }
                  />
                </div>

                <h5 className="mt-8">
                  POUR TOUTE URGENCE, ME CONTACTER DIRECTEMENT VIA LE
                  <Link
                    href="/contact"
                    className="bg-dark-green bg-opacity-30 rounded-lg hover:text-dark-green hover:bg-beige hover:drop-shadow-lg"
                    aria-label="Accéder au formulaire de contact"
                  >
                    {" "}
                    FORMULAIRE DU SITE.
                  </Link>
                </h5>
              </section>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver un soin énergétique"
          lien="https://form.jotform.com/233515437828361"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default EnergyCare;
