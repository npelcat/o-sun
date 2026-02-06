import { BookingStatus } from "@/lib/constants";

export interface BookingWithDetails {
  // Booking
  id: string;
  status: BookingStatus;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Time slot
  timeSlotId: string;
  startTime: Date;
  endTime: Date;
  isTimeSlotActive: boolean;
  // Client
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  // Form data
  formId: string;
  animalName: string;
  animalType: string | null;
  service: string;
  answers: string | null;
  formCreatedAt: Date;
}
