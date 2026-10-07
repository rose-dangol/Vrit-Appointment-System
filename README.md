# Vrit Appointment System

An appointment booking system with a Django backend and React/TypeScript frontend.

## Project Structure

```text
Vrit Appointment System/
├── salonBookingBackend/    # Django backend
└── salonBookingApp/        # React/TypeScript frontend
```

## Setup Instructions

### Backend Setup — Django

```bash
cd salonBookingBackend
```

```bash
python -m venv venv
```

```powershell
.\venv\Scripts\Activate.ps1
```

```cmd
venv\Scripts\activate
```

```bash
python manage.py migrate

```

```bash
python manage.py seed
```

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

---

## Frontend Setup — React/TypeScript

Open a **new terminal** and navigate to the frontend directory:

```bash
cd salonBookingApp
```

```bash
npm install
```

```bash
npm run dev
```

The frontend is running at:

```text
http://localhost:5173/
```

---

## Running the Project

You need to run both the backend and frontend development servers.

### Terminal 1 — Backend

```bash
cd salonBookingBackend
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

### Terminal 2 — Frontend

```bash
cd salonBookingApp
npm install
npm run dev
```

Once both servers are running, open the frontend URL shown in the terminal.
