import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices } from "../api/services";
import { addAppointment } from "../api/appointments";

export default function BookingPage({
  onBookingSuccess,
}: {
  onBookingSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    serviceId: "",
    date: "",
    time: "",
    notes: "",
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const addAppointmentMutation = useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      console.log("HIT");
      setFormData({
        customerName: "",
        customerPhone: "",
        serviceId: "",
        date: "",
        time: "",
        notes: "",
      });
      alert("Appointment booked successfully!");
      onBookingSuccess();
    },
    onError: (error: Error) => {
      alert(`Failed to book appointment: ${error.message}`);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("HIT");
    if (
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.serviceId ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const selectedService = services.find((s) => String(s.id) === formData.serviceId);
    console.log(selectedService);
    if (!selectedService) return;

    addAppointmentMutation.mutate({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      serviceId: formData.serviceId,
      serviceName: selectedService.name,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      <h2 className="text-center font-black text-xl">Book an Appointment</h2>

      <form
        onSubmit={handleSubmit}
        className="p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Phone *
          </label>
          <input
            type="text"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Service *
          </label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">-- Select a service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} (Rs. {service.price})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={addAppointmentMutation.isPending}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {addAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
