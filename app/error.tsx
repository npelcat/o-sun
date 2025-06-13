"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h2 className="text-2xl font-bold mb-2 text-dark-beige">Oups !</h2>
      <p className="mb-4 text-black max-w-md">
        {error.message || "Une erreur inconnue est survenue."}
      </p>
      <Button
        titleButton="Réessayer"
        onClick={reset}
        className="text-base p-2 max-w-[200px]"
      />
    </div>
  );
}
