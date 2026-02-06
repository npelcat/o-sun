// src/hooks/useTimeslotForm.ts
import { useState } from "react";
import { DateTime } from "luxon";

interface UseTimeslotFormProps {
  initialStartTime?: Date | string;
  initialEndTime?: Date | string;
  initialIsActive?: boolean;
}

export function useTimeslotForm({
  initialStartTime,
  initialEndTime,
  initialIsActive = true,
}: UseTimeslotFormProps = {}) {
  // Initialisation des valeurs
  const getInitialDates = () => {
    if (initialStartTime && initialEndTime) {
      const startDT = DateTime.fromJSDate(
        typeof initialStartTime === "string"
          ? new Date(initialStartTime)
          : initialStartTime,
        { zone: "Europe/Paris" },
      );
      const endDT = DateTime.fromJSDate(
        typeof initialEndTime === "string"
          ? new Date(initialEndTime)
          : initialEndTime,
        { zone: "Europe/Paris" },
      );

      return {
        startDate: startDT.toFormat("yyyy-MM-dd"),
        startTime: startDT.toFormat("HH:mm"),
        endDate: endDT.toFormat("yyyy-MM-dd"),
        endTime: endDT.toFormat("HH:mm"),
      };
    }

    return {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    };
  };

  const initial = getInitialDates();
  const [startDate, setStartDate] = useState(initial.startDate);
  const [startTime, setStartTime] = useState(initial.startTime);
  const [endDate, setEndDate] = useState(initial.endDate);
  const [endTime, setEndTime] = useState(initial.endTime);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [error, setError] = useState("");

  // Synchroniser endDate avec startDate si endDate est vide
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setEndDate(date);
  };

  // Validation et conversion des dates
  const validateAndConvert = (): {
    isValid: boolean;
    startISO?: string;
    endISO?: string;
    error?: string;
  } => {
    // Vérifier que tous les champs sont remplis
    if (!startDate || !startTime || !endDate || !endTime) {
      return {
        isValid: false,
        error: "Tous les champs sont requis",
      };
    }

    // Construire les DateTime
    const startDT = DateTime.fromISO(`${startDate}T${startTime}`, {
      zone: "Europe/Paris",
    });
    const endDT = DateTime.fromISO(`${endDate}T${endTime}`, {
      zone: "Europe/Paris",
    });

    // Vérifier que les dates sont valides
    if (!startDT.isValid || !endDT.isValid) {
      return {
        isValid: false,
        error: "Format de date invalide",
      };
    }

    // Vérifier que la fin est après le début
    if (endDT <= startDT) {
      return {
        isValid: false,
        error: "La date de fin doit être après la date de début",
      };
    }

    // Vérifier que c'est dans le futur (seulement pour la création)
    if (!initialStartTime) {
      const now = DateTime.now();
      if (startDT <= now) {
        return {
          isValid: false,
          error: "La date de début doit être dans le futur",
        };
      }
    }

    // Convertir en ISO 8601 (UTC)
    const startISO = startDT.toUTC().toISO();
    const endISO = endDT.toUTC().toISO();

    if (!startISO || !endISO) {
      return {
        isValid: false,
        error: "Erreur de conversion de date",
      };
    }

    return {
      isValid: true,
      startISO,
      endISO,
    };
  };

  return {
    // Valeurs
    startDate,
    startTime,
    endDate,
    endTime,
    isActive,
    error,

    // Setters
    setStartDate: handleStartDateChange,
    setStartTime,
    setEndDate,
    setEndTime,
    setIsActive,
    setError,

    // Utilitaires
    validateAndConvert,
  };
}
