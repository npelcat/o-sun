import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseBookingTimerProps {
  timeSlotId: string | null;
  expiresAtParam: string | null;
  onWarning: (message: string) => void;
}

export const useBookingTimer = ({
  timeSlotId,
  expiresAtParam,
  onWarning,
}: UseBookingTimerProps) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const releaseSlot = useCallback(async () => {
    if (!timeSlotId) return;
    try {
      await fetch("/api/booking/release-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeSlotId }),
      });
    } catch (err) {
      console.error("Erreur lors de la libération du créneau :", err);
    }
  }, [timeSlotId]);

  // Timer countdown
  useEffect(() => {
    if (!expiresAtParam) return;

    const expiresAt = new Date(expiresAtParam);
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt.getTime() - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAtParam]);

  // Auto-release on timeout
  useEffect(() => {
    if (!expiresAtParam || !timeSlotId) return;

    const expiresAt = new Date(expiresAtParam);
    const timeUntilExpiry = expiresAt.getTime() - Date.now();

    if (timeUntilExpiry <= 0) {
      releaseSlot();
      onWarning(
        "Le temps est écoulé. Veuillez sélectionner un nouveau créneau."
      );
      router.push("/contact/newbooking");
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      await releaseSlot();
      onWarning("Temps écoulé ! Le créneau a été libéré.");
      router.push("/contact/newbooking");
    }, timeUntilExpiry);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [expiresAtParam, timeSlotId, router, releaseSlot, onWarning]);

  const cancelBooking = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    await releaseSlot();
    onWarning("Réservation annulée.");
    router.push("/contact/newbooking");
  }, [releaseSlot, router, onWarning]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const isTimeRunningOut = timeLeft <= 5 * 60 && timeLeft > 0;

  return {
    timeLeft,
    isTimeRunningOut,
    cancelBooking,
    clearTimer,
  };
};
