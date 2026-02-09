# Hackfest Deployment Guide

This guide will walk you through deploying the Hackfest application.

## Prerequisites
- A **GitHub** account (where your code is hosted).
- A **Render** account (for Backend & Database).
- A **Vercel** account (for Frontend).
- **MongoDB Atlas** account (or use Render's managed MongoDB).

---

## 1. Backend Deployment (Render)

The backend is a Node.js/Express app located in the `backend` folder.

1.  **Push your code to GitHub**.
2.  **Create a New Web Service on Render**:
    - Go to [dashboard.render.com](https://dashboard.render.com/).
    - Click **New +** -> **Web Service**.
    - Connect your GitHub repository.
3.  **Configure the Service**:
    - **Name**: `hackfest-backend` (example).
    - **Root Directory**: `backend` (Important! This tells Render to look in the backend folder).
    - **Environment**: `Node`.
    - **Region**: Select a region close to you (e.g., Singapore, Frankfurt).
    - **Build Command**: `npm install` (We added a dummy build script so this works fine).
    - **Start Command**: `npm start`.
4.  **Environment Variables**:
    - Scroll down to the **Environment Variables** section and add:
        - `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
        - `JWT_SECRET`: A strong secret key (e.g., `my_super_secret_key_123`).
        - `NODE_ENV`: `production`.
        - `FRONTEND_URL`: Leave empty for now, or put `*` initially. You will update this after deploying the frontend.
5.  **Deploy**: Click **Create Web Service**.
    - Wait for the build to finish. It should say "Build successful" and "Server running".
    - Copy the **Service URL** (e.g., `https://hackfest-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

The frontend is a Vite/React app in the root directory.

1.  **Create a New Project on Vercel**:
    - Go to [vercel.com/new](https://vercel.com/new).
    - Import your GitHub repository.
2.  **Configure the Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: `./` (Root).
    - **Build Command**: `vite build`.
    - **Output Directory**: `dist`.
    - **Install Command**: `npm install`.
3.  **Environment Variables**:
    - Setup the API URL to point to your new backend.
    - Key: `VITE_API_BASE_URL`
    - Value: `https://hackfest-backend.onrender.com/api` (Your backend URL + `/api`).
        - **Note**: Ensure you include `/api` if your backend routes are prefixed with it.
4.  **Deploy**: Click **Deploy**.
    - Wait for deployment to finish.
    - Copy the **Domain** (e.g., `https://hackfest.vercel.app`).

---

## 3. Post-Deployment Configuration (Connecting them)

Now that both are deployed, link them securely.

1.  **Update Backend CORS**:
    - Go back to your **Render Dashboard** -> **Environment Variables**.
    - Add or Update `FRONTEND_URL` with your Vercel URL (e.g., `https://hackfest.vercel.app`).
    - Render will automatically redeploy the backend.

2.  **Test**:
    - Open your Vercel app.
    - Try to login/register.
    - Check the console for any errors.

---

## Troubleshooting

- **"Missing script: build" on Render**: Ensure you pushed the latest changes where we added `"build": "echo 'No build step required'"` to `backend/package.json`.
- **CORS Errors**: Check your `FRONTEND_URL` in Render matches the Vercel URL exactly (usually no trailing slash).
- **404 on Refresh**: If refreshing a page gives 404, ensure the `vercel.json` file is present in your root directory.
