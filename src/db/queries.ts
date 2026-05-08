import { bookings, clients, timeSlots, formData } from "@/src/db/schema";

export const bookingSelectFields = {
  // Booking
  id: bookings.id,
  status: bookings.status,
  createdAt: bookings.createdAt,
  updatedAt: bookings.updatedAt,
  adminNotes: bookings.adminNotes,
  // Time slot
  timeSlotId: timeSlots.id,
  startTime: timeSlots.startTime,
  endTime: timeSlots.endTime,
  isTimeSlotActive: timeSlots.isActive,
  // Client
  clientId: clients.id,
  clientName: clients.name,
  clientEmail: clients.email,
  clientPhone: clients.phone,
  // Form data
  formId: formData.id,
  animalName: formData.animalName,
  animalType: formData.animalType,
  service: formData.service,
  answers: formData.answers,
  formCreatedAt: formData.createdAt,
  serviceSpecificAnswers: formData.serviceSpecificAnswers,
  animalInfo: formData.animalInfo,
  householdInfo: formData.householdInfo,
  preferredPronoun: formData.preferredPronoun,
  socialMediaConsent: formData.socialMediaConsent,
  monthlyPlanningAck: formData.monthlyPlanningAck,
} as const;
