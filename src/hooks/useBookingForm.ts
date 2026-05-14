import { useState } from "react";

import { useBookingFields } from "./useBookingFields";
import { useBookingSubmit } from "./useBookingSubmit";

export interface FormData {
  // Infos client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  // Infos animal
  animalName: string;
  animalType: string;
  animalInfo: string;
  // Infos foyer
  householdInfo: string;
  // Service
  service: string;
  serviceSpecificAnswers: Record<string, string>;
  answers: string;
  // Consentements & préférences
  preferredPronoun: "tutoiement" | "vouvoiement" | "";
  socialMediaConsent: boolean;
  monthlyPlanningAck: boolean;
  cgvAccepted: boolean;
}

const initialFormData: FormData = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  animalName: "",
  animalType: "",
  animalInfo: "",
  householdInfo: "",
  service: "",
  serviceSpecificAnswers: {},
  answers: "",
  preferredPronoun: "",
  socialMediaConsent: false,
  monthlyPlanningAck: false,
  cgvAccepted: false,
};

interface UseBookingFormProps {
  timeSlotId: string | null;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onClearTimer: () => void;
}

export const useBookingForm = ({
  timeSlotId,
  onError,
  onSuccess,
  onClearTimer,
}: UseBookingFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    emailWarning,
    handleChange,
    handleCheckboxChange,
    handleServiceChange,
    handleServiceSpecificChange,
    handleBlur,
  } = useBookingFields({ fieldErrors, setFormData, setFieldErrors });

  const { handleSubmit } = useBookingSubmit({
    formData,
    timeSlotId,
    turnstileToken,
    setIsSubmitting,
    setFieldErrors,
    onError,
    onSuccess,
    onClearTimer,
  });

  return {
    formData,
    fieldErrors,
    isSubmitting,
    emailWarning,
    turnstileToken,
    setTurnstileToken,
    handleChange,
    handleCheckboxChange,
    handleServiceChange,
    handleServiceSpecificChange,
    handleBlur,
    handleSubmit,
  };
};
