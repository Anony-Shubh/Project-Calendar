# Simple Calendar App

A simple calendar app that allows users to schedule and manage events with basic CRUD functionality, browser notifications, and media attachments.

## Features

- **Create, Read, Update, Delete (CRUD)** for events
- Browser notifications for scheduled tasks with **dismiss** and **snooze** options
- Events can have **pictures, videos, and text**
- **Search** and **filter** options for events
- **User-friendly interface** with a calendar display for managing events

## Tech Stack

- **Frontend**: React, Next.js, Tailwind
- **Backend**: Nest.js
- **Database**: In-memory (for demo purposes)

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js**: v14+ [Download Node.js](https://nodejs.org/)
- **npm**: Installed with Node.js

1. Clone the repository:

   ```bash
   git clone https://github.com/Anony-Shubh/Project-Calendar
   cd cal
   ```

### Backend Setup

2. Navigate to the backend directory:

   ```bash
   cd calendar-app-frontend
   ```

3. Install dependencies:

   ```bash
   npm i 
   or 
   npm install
   ```

4. Start the Nest.js server:

   ```bash
   npm run start:dev
   ```

5. The backend server will run at `http://localhost:3000`.


### Frontend Setup

6. Navigate to the frontend directory:

   ```bash
   cd calendar-app-frontend
   ```

7. Install dependencies:

   ```bash
   npm i 
   or 
   npm install
   ```

8. Start the development server:

   ```bash
   npm run dev
   ```

9. Open your browser and visit `http://localhost:3001` to see the app running.

The backend will be available at http://localhost:3000, and the frontend will typically be at http://localhost:3001 (Next.js will automatically choose an available port).



---
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---