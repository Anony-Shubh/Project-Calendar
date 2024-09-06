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


### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd calendar-app-frontend
   ```

2. Install dependencies:

   ```bash
   npm i 
   or 
   npm install
   ```

3. Start the Nest.js server:

   ```bash
   npm run start:dev
   ```

4. The backend server will run at `http://localhost:3000`.


### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Anony-Shubh/Project-Calendar
   cd cal
   ```

2. Navigate to the frontend directory:

   ```bash
   cd calendar-app-frontend
   ```

3. Install dependencies:

   ```bash
   npm i 
   or 
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3001` to see the app running.

The backend will be available at http://localhost:3000, and the frontend will typically be at http://localhost:3001 (Next.js will automatically choose an available port).



---

## API Endpoints

| Endpoint           | Method | Description               |
|--------------------|--------|---------------------------|
| `/events`          | GET    | Get all events            |
| `/events/:id`      | GET    | Get event by ID           |
| `/events`          | POST   | Create a new event        |
| `/events/:id`      | PUT    | Update an event           |
| `/events/:id`      | DELETE | Delete an event           |

---

## Browser Notifications

When an event's scheduled time is reached, a notification will appear in the browser. You can either:
- **Dismiss** the notification, which removes it.
- **Snooze** the notification, which will remind you again in 5 minutes.

---

## Event Media Attachments

When creating or editing an event, you can upload **images** or **videos** along with text descriptions.

---

## Search and Filter Options (Optional)

Search and filter events using keywords or date ranges. This can be enabled through the frontend UI.

---

## Contributing

Feel free to submit a pull request or raise an issue if you find a bug or have a feature request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README should provide clear instructions on how to set up and run both the frontend and backend of your calendar app. Let me know if you need any modifications!