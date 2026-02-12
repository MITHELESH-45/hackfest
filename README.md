# Hackfest - Hackathon Management System

Hackfest is a comprehensive web-based platform designed to streamline the entire lifecycle of a hackathon. From team registration and theme management to real-time evaluation and leaderboard generation, Hackfest empowers organizers, judges, and participants with a seamless experience.

## 🚀 Features

### for **Organizers (Admin)**
*   **Theme Management**: Create and manage problem statements/themes.
*   **Team Management**: Register teams and auto-generate credentials for team leaders.
*   **Judge Management**: Onboard judges and assign them to specific themes.
*   **Round Control**: Manage the flow of the event by starting/stopping rounds (Round 1: Idea, Round 2: Prototype, Round 3: Presentation).
*   **Timeline**: Schedule and display event activities.
*   **Live Leaderboard**: View real-time standings across all rounds.

### for **Judges**
*   **Dedicated Dashboard**: View assigned teams and themes.
*   **Digital Evaluation**: Score teams based on predefined criteria (Innovation, Implementation, Presentation, Impact).
*   **Round-Specific Scoring**: Evaluate teams based on their progress in the current active round.

### for **Participants**
*   **Team Dashboard**: View team status, assigned theme, and timeline.
*   **Readiness Check**: Mark team as "Ready" for evaluation in active rounds.
*   **Feedback**: Receive feedback from judges to improve in subsequent rounds.
*   **Complaint System**: Raise technical or evaluation-related issues directly to admins.

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite), Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd hackfest
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        FRONTEND_URL=http://localhost:5173
        NODE_ENV=development
        ```

3.  **Frontend Setup**
    ```bash
    cd .. # Go back to root
    npm install
    ```
    *   Create a `.env` file in the root directory:
        ```env
        VITE_API_BASE_URL=http://localhost:5000/api
        ```

## 🚀 Running the Application

1.  **Start the Backend**
    ```bash
    cd backend
    npm run dev
    ```
    *   Server will start on `http://localhost:5000`.

2.  **Start the Frontend**
    ```bash
    # In a new terminal, from the root directory
    npm run dev
    ```
    *   Client will start on `http://localhost:5173`.

## 📖 Usage Workflow

1.  **Admin Setup**:
    *   Log in as Admin.
    *   Create **Themes**, **Judges**, and **Teams**.
    *   Distribute generated credentials to Team Leaders.

2.  **Event Flow**:
    *   **Round 1 (Thinking/Idea)**: Admin starts round -> Teams mark "Ready" -> Judges evaluate.
    *   **Round 2 (Prototyping)**: Admin advances round -> Teams update & mark "Ready" -> Judges evaluate progress.
    *   **Round 3 (Presentation)**: Admin advances round -> Teams present (no system readiness check) -> Judges evaluate final pitch.

3.  **Results**:
    *   Admin publishes the final leaderboard.

*For a detailed step-by-step guide, please refer to definitions in `workflow_guide.md`.*

## 📂 Project Structure

```
hackfest/
├── backend/                # Express Backend
│   ├── src/
│   │   ├── config/         # DB Connection
│   │   ├── controllers/    # Route Logic
│   │   ├── middleware/     # Auth & Error Handling
│   │   ├── models/         # Mongoose Schemas
│   │   └── routes/         # API Routes
│   └── server.js           # Entry Point
├── src/                    # React Frontend
│   ├── api/                # API Service Layer
│   ├── components/         # Reusable Components
│   ├── context/            # Auth Context
│   ├── pages/              # Application Pages
│   └── App.jsx             # Main Component
└── README.md               # Project Documentation
```



