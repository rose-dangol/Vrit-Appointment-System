import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  type AppointmentStatus,
} from "../api/appointments";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const handleStatusChange = (
    id: string,
    newStatus: AppointmentStatus,
  ) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredAppointments =
    statusFilter === "All"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  if (isLoading) return <div>Loading appointments...</div>;

  return (
    <div>
      <h2>Appointment Listing</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Filter by Status: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <table
        border={1}
        cellPadding={8}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.customerName}</td>
              <td>{appointment.serviceName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>
                <select
                  value={appointment.status}
                  onChange={(e) =>
                    handleStatusChange(
                      appointment.id,
                      e.target.value as AppointmentStatus,
                    )
                  }
                  disabled={updateStatusMutation.isPending}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredAppointments.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
