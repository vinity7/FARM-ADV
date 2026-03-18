# Farm Advisory Dashboard (Integrated)

A full-stack agricultural advisor application for farmers in Kerala, featuring real-time market prices, AI-driven crop diagnosis (Groq Llama-3), and integrated crop calendars.

## Core Features
- **Live Mandi Prices**: Real-time price updates via Socket.io.
- **AI Farm Advisor**: Assistant for crop diagnosis and advice in Malayalam (supports Image & Voice).
- **Crop Calendar**: Seasonal schedules for Paddy, Coconut, Banana, and more, tailored to Kerala districts.
- **Unified Dashboard**: Personalized overview of weather, prices, and tasks.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, TailwindCSS, Lucide Icons, FullCalendar, Recharts.
- **Backend**: Node.js, Express, MongoDB, Socket.io, Cloudinary (for images), Groq SDK (for AI).

## Setup & Running

### Prerequisites
- Node.js installed.
- MongoDB Atlas account (or local MongoDB).
- Cloudinary account for file uploads.
- Groq API key for the AI assistant.

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env`:
    ```env
    PORT=5000
    MONGO_URI=<your_mongodb_uri>
    JWT_SECRET=<your_secret>
    GROQ_API=<your_groq_api_key>
    CLOUDINARY_CLOUD_NAME=<name>
    CLOUDINARY_API_KEY=<key>
    CLOUDINARY_API_SECRET=<secret>
    ```

### Run the Application
To run both the backend and frontend at once:
```bash
npm run dev:all
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### Individual Running
- **Server Only**: `npm run server`
- **Frontend Only**: `npm run dev`
