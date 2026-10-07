import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  addService,
  updateService,
  deleteService,
  type Service,
} from "../api/services";

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const addMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setFormData({ name: "", price: "", duration: "" });
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setFormData({ name: "", price: "", duration: "" });
      setIsEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) return;

    if (isEditing) {
      updateMutation.mutate({
        id: isEditing,
        name: formData.name,
        price: Number(formData.price),
        duration: Number(formData.duration),
      });
    } else {
      addMutation.mutate({
        name: formData.name,
        price: Number(formData.price),
        duration: Number(formData.duration),
      });
    }
  };

  const handleEdit = (service: Service) => {
    setIsEditing(service.id);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({ name: "", price: "", duration: "" });
  };

  if (isLoading) return <div>Loading services...</div>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center font-black text-xl">Services Management</h2>

      <div className="mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Add New Service
        </button>
      </div>

      {(isOpen || isEditing) && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 max-w-md"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {isEditing ? "Edit Service" : "Add New Service"}
          </h3>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Rs.)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              min={1}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              min={1}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={addMutation.isPending || updateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isEditing ? "Update Service" : "Add Service"}
            </button>

            <button
              type="button"
              onClick={() => {
                handleCancelEdit();
                setIsOpen(false);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table
        border={1}
        cellPadding={8}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Duration (mins)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td className="text-center">{service.name}</td>
              <td className="text-center">Rs.{service.price}</td>
              <td className="text-center">{service.duration}</td>
              <td className="text-center">
                <button onClick={() => handleEdit(service)}>Edit</button>
                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={deleteMutation.isPending}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center">
                No services available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
