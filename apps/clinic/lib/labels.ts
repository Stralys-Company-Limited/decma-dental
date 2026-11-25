import type { AppointmentStatus, AppointmentType } from "@decma/booking";

export const appointmentTypeLabels: Record<AppointmentType, string> = {
  "new-patient": "New patient / first visit",
  "check-up": "Check-up and cleaning",
  toothache: "Toothache / urgent",
  fillings: "Fillings / root canal",
  cosmetic: "Cosmetic dentistry",
  orthodontics: "Orthodontics",
  implants: "Dental implants",
  children: "Paediatric dentistry",
};

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  arrived: "Arrived",
  completed: "Completed",
  no_show: "No-show",
  cancelled: "Cancelled",
};

export const statusStyle: Record<AppointmentStatus, string> = {
  pending: "bg-navy-20 text-navy",
  confirmed: "bg-teal-20 text-navy-deep",
  arrived: "bg-teal-40 text-navy-deep",
  completed: "bg-ink-20 text-ink-80",
  no_show: "bg-ink-20 text-ink-80",
  cancelled: "bg-ink-20 text-ink-80 line-through",
};

export const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
