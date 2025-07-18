export interface BookingWithDetails {
  id: string;
  status: "pending" | "confirmed" | "canceled";
  createdAt: Date;

  timeSlotId: string;
  startTime: Date;
  endTime: Date;
  isTimeSlotActive: boolean;

  formId: string;
  clientName: string;
  clientEmail: string;
  clientContent: string | null;
  formCreatedAt: Date;
}
