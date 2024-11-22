"use client";

import { Button } from "@/src/components/Button";
import { NextPage } from "next";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import Link from "next/link";
import { PiMoonStarsThin } from "react-icons/pi";
import { IoIosArrowDropright } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { GiFallingLeaf } from "react-icons/gi";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { PiHandHeartLight } from "react-icons/pi";
import { TextEditor } from "@/src/components/TextEditor";
import { useEffect, useState } from "react";

type ContentSection = {
  id: number;
  page_id: number;
  part: string;
  content: string;
  last_updated: string;
};

const ServicesIndex: NextPage = () => {
  const [content, setContent] = useState<ContentSection[]>([]);

  // Récupérer le contenu de la base de données via l'API
  const fetchContent = async () => {
    const response = await fetch("/api/content/4"); //ID de la page souhaitée (cette page ci)
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
      <h2 className="text-3xl font-subtitle font-bold">
        La communication animale
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="flex flex-col gap-4 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="Qu'est-ce que c'est ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402554/IMG_6702_f4snyr.jpg"
            alt="Océane et un de ses bergers australien en contre-jour dans le coucher du soleil"
          />
          <TextEditor
            initialText={getPartContent("Com animale explication gen") || ""}
            part="Com animale explication gen"
            onSave={(updatedText) =>
              handleSave(updatedText, "Com animale explication gen", 4)
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
        <div className="flex flex-col gap-4 p-8 w-full md:w-3/5">
          <CardTitlePhoto
            title="A quoi ça sert ?"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402549/DSC03447_qlifqp.jpg"
            alt="Encolure et tête du cheval d'Océane, Ghost, qui regarde vers un plan d'eau"
          />
          <TextEditor
            initialText={getPartContent("Com animale pourquoi part 1") || ""}
            part="Com animale pourquoi part 1"
            onSave={(updatedText) =>
              handleSave(updatedText, "Com animale pourquoi part 1", 4)
            }
          />
          <span className="flex justify-center">
            <PiMoonStarsThin aria-hidden="true" />
          </span>
          <TextEditor
            initialText={getPartContent("Com animale pourquoi part 2") || ""}
            part="Com animale pourquoi part 2"
            onSave={(updatedText) =>
              handleSave(updatedText, "Com animale pourquoi part 2", 4)
            }
          />
          <span className="flex justify-center">
            <PiMoonStarsThin aria-hidden="true" />
          </span>
          <TextEditor
            initialText={getPartContent("Com animale pourquoi part 3") || ""}
            part="Com animale pourquoi part 3"
            onSave={(updatedText) =>
              handleSave(updatedText, "Com animale pourquoi part 3", 4)
            }
          />
          <Button
            titleButton="Réserver une communication"
            lien="https://form.jotform.com/232924829211052"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-center bg-dark-beige">
        <div className=" py-8 w-full md:w-3/5  px-4">
          <CardTitlePhoto
            title="Infos pratiques"
            image="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719402553/IMG_7041_u1eddf.jpg"
            alt="Tête d'un berger australien tricolore"
          />
          <div>
            <Accordion title="Avec qui puis-je communiquer ?">
              <section className="text-justify">
                <div className="flex">
                  <span className="text-2xl">
                    <IoIosArrowDropright
                      className="w-6 h-6 mr-2 text-2xl"
                      aria-hidden="true"
                    />
                  </span>
                  <TextEditor
                    initialText={
                      getPartContent("Com ani avec qui part 1") || ""
                    }
                    part="Com ani avec qui part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Com ani avec qui part 1", 4)
                    }
                  />
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl">
                    <CgDanger className="w-6 h-6 mr-2" aria-hidden="true" />
                  </span>
                  <TextEditor
                    initialText={
                      getPartContent("Com ani avec qui part 2") || ""
                    }
                    part="Com ani avec qui part 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Com ani avec qui part 2", 4)
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
                      getPartContent("Com ani avec qui part 3") || ""
                    }
                    part="Com ani avec qui part 3"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Com ani avec qui part 3", 4)
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
                      getPartContent("Com ani avec qui part 4") || ""
                    }
                    part="Com ani avec qui part 4"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "Com ani avec qui part 4", 4)
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
                    initialText={getPartContent("seance pratique part 1") || ""}
                    part="seance pratique part 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "seance pratique part 1", 4)
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
                    initialText={getPartContent("seance pratique part 2") || ""}
                    part="seance pratique part 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "seance pratique part 2", 4)
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
                    initialText={getPartContent("seance pratique part 3") || ""}
                    part="seance pratique part 3"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "seance pratique part 3", 4)
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
                    initialText={getPartContent("seance pratique part 4") || ""}
                    part="seance pratique part 4"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "seance pratique part 4", 4)
                    }
                  />
                </div>
                <br />
                <div className="flex">
                  <span className="text-2xl pr-2">
                    <CgDanger className="w-6 h-6 mr-2" aria-hidden="true" />
                  </span>
                  <TextEditor
                    initialText={getPartContent("seance pratique part 4") || ""}
                    part="seance pratique part 4"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "seance pratique part 4", 4)
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
                      Communication animale guidée par les cartes Oracles ~ 20 €
                    </h3>
                  </div>
                  <TextEditor
                    initialText={getPartContent("prestation 1") || ""}
                    part="prestation 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation 1", 4)
                    }
                  />
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf
                        className="w-6 h-6 mr-2"
                        aria-hidden="true"
                      />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale message ~ 35 €
                    </h3>
                  </div>
                  <TextEditor
                    initialText={getPartContent("prestation 2") || ""}
                    part="prestation 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation 2", 4)
                    }
                  />
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf
                        className="w-6 h-6 mr-2"
                        aria-hidden="true"
                      />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale ~ 65 €
                    </h3>
                  </div>
                  <TextEditor
                    initialText={getPartContent("prestation 3") || ""}
                    part="prestation 3"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation 3", 4)
                    }
                  />
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf
                        className="w-6 h-6 mr-2"
                        aria-hidden="true"
                      />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale défunt ~ 65 €
                    </h3>
                  </div>
                  <TextEditor
                    initialText={getPartContent("prestation 4") || ""}
                    part="prestation 4"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation 4", 4)
                    }
                  />
                </div>
                <br />
                <div>
                  <div className="flex">
                    <span className="text-2xl pr-2">
                      <GiFallingLeaf
                        className="w-6 h-6 mr-2"
                        aria-hidden="true"
                      />{" "}
                    </span>
                    <h3 className="font-subtitle font-bold pb-4">
                      Communication animale de suivi ~ 20 €
                    </h3>
                  </div>
                  <TextEditor
                    initialText={getPartContent("prestation 5") || ""}
                    part="prestation 5"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation 5", 4)
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
                    initialText={getPartContent("prestation 6") || ""}
                    part="prestation 6"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "prestation 6", 4)
                    }
                  />
                </div>

                <h5 className="mt-8">
                  POUR TOUTE URGENCE, ME CONTACTER DIRECTEMENT VIA LE
                  <Link
                    href="/contact"
                    aria-label="Accéder au formulaire de contact"
                    className="bg-dark-green bg-opacity-30 rounded-lg hover:text-dark-green hover:bg-beige hover:drop-shadow-lg"
                  >
                    {" "}
                    FORMULAIRE DU SITE.
                  </Link>
                </h5>
              </section>
            </Accordion>
            <Accordion title="Les PACKS">
              <section className="text-justify">
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
                    initialText={getPartContent("pack 1") || ""}
                    part="pack 1"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "pack 1", 4)
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
                      Pack Accompagnement Fin de vie – 160€
                    </h3>
                  </div>
                  <TextEditor
                    initialText={getPartContent("pack 2") || ""}
                    part="pack 2"
                    onSave={(updatedText) =>
                      handleSave(updatedText, "pack 2", 4)
                    }
                  />
                </div>
              </section>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver une communication animale"
          lien="https://form.jotform.com/232924829211052"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center mt-12 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default ServicesIndex;
