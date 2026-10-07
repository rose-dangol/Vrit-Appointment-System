import { useState } from "react";
import "./app.css";
import ServicesPage from "./pages/ServicesPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import BookingPage from "./pages/BookingPage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "services" | "appointments" | "booking"
  >("services");

  return (
    <div className="p-5 flex flex-col gap-3 justify-center">
      <h1 className="text-center font-black text-xl">
        Salon Appointment Booking System
      </h1>

      <nav className="mb-5 pb-2.5 border-b-2 border-amber-600 text-center">
        <button
          onClick={() => setCurrentPage("services")}
          className={`mr-5 cursor-pointer ${currentPage === "services" ? "font-bold" : "font-medium"}`}
        >
          Services Management
        </button>
        <button
          onClick={() => setCurrentPage("booking")}
          className={`mr-5 cursor-pointer ${currentPage === "booking" ? "font-bold" : "font-medium"}`}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setCurrentPage("appointments")}
          className={` cursor-pointer ${currentPage === "appointments" ? "font-bold" : "font-medium"}`}
        >
          Appointment Listing
        </button>
      </nav>

      <main>
        {currentPage === "services" && <ServicesPage />}
        {currentPage === "booking" && (
          <BookingPage
            onBookingSuccess={() => setCurrentPage("appointments")}
          />
        )}
        {currentPage === "appointments" && <AppointmentsPage />}
      </main>
    </div>
  );
}

export default App;
