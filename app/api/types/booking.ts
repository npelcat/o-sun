export interface BookingWithDetails {
  id: string;
  status: "pending" | "confirmed" | "canceled";
  createdAt: Date;

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
  service: string;
  answers: string | null; // JSON stringifié
  formCreatedAt: Date;
}
