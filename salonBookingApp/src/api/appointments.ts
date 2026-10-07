export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
}
const api = import.meta.env.VITE_BASE_URL;

export const getAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch(api + "bookings/");
  if (!res.ok) throw new Error("Error fetching appointments");
  return res.json();
};

export const addAppointment = async (
  appointment: Omit<Appointment, "id" | "status">,
): Promise<Appointment> => {
  const res = await fetch(api + "bookings/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointment),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage =
      errorData.non_field_errors?.[0] ||
      errorData.detail ||
      "Error adding appointment";
    throw new Error(errorMessage);
  }
  return res.json();
};

export const updateAppointmentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: AppointmentStatus;
}): Promise<Appointment> => {
  const res = await fetch(`${api}bookings/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Error updating appointment status");
  return res.json();
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  const res = await fetch(`${api}bookings/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting appointment");
  return true;
};
