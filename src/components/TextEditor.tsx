"use client";

import { useEffect, useState } from "react";

interface TextEditorProps {
  initialText: string; // Le texte initial à afficher
  part: string; // La partie (clé) liée au texte
  onSave: (updatedText: string, part: string) => void; // Callback pour sauvegarder
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialText,
  part,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  // Mettre à jour le texte local si initialText change
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSave = () => {
    onSave(text, part); // Appelle la fonction pour sauvegarder
    setIsEditing(false); //Ferme le mode édition
  };

  const handleCancel = () => {
    setText(initialText); // Réinitialise le texte à sa valeur initiale
    setIsEditing(false); // Ferme le mode édition
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full sm:min-w-[300px] md:max-w-[600px] lg:max-w-[800px] p-2 border rounded"
              rows={8}
            />
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleSave}
              className="bg-dark-green text-white px-4 py-2 rounded hover:text-black hover:bg-dark-beige transition duration-300 ease-in-out"
            >
              Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className=" bg-dark-green text-white px-4 py-2 rounded hover:text-black hover:bg-dark-beige transition duration-300 ease-in-out"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>{initialText}</p>
          <button
            onClick={() => setIsEditing(true)}
            className=" rounded-full p-2 hover:scale-125 text-2xl transition duration-300 ease-in-out"
          >
            🖍
          </button>
        </div>
      )}
    </div>
  );
};
