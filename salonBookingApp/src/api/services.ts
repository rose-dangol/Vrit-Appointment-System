export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}
const api = import.meta.env.VITE_BASE_URL;

export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(api + "services/");
  if (!response.ok) throw new Error("Error fetching services");
  return response.json();
};

export const addService = async (
  service: Omit<Service, "id">,
): Promise<Service> => {
  const response = await fetch(api + "services/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error("Error adding service");
  return response.json();
};

export const updateService = async ({
  id,
  ...updatedFields
}: Partial<Service> & { id: string }): Promise<Service> => {
  const response = await fetch(`${api}services/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });
  if (!response.ok) throw new Error("Error updating service");
  return response.json();
};

export const deleteService = async (id: string): Promise<boolean> => {
  const response = await fetch(`${api}services/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error deleting service");
  return true;
};
