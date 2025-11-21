# 🚀 Free & Optimal Deployment Guide

Since Railway is paid, we will use the **"Golden Free Stack"** for 2025:
1.  **Database:** **TiDB Cloud** (Free Serverless MySQL)
2.  **Backend:** **Render** (Free Web Service)
3.  **Frontend:** **Vercel** (Free Static/Edge Hosting)

---

## 🛠 Step 1: Free Database (TiDB Cloud)

1.  Go to [TiDB Cloud](https://tidbcloud.com/) and Sign Up (Free).
2.  Create a **"Serverless Tier"** cluster (Free forever, 5GB storage).
3.  Give it a name (e.g., `ag-website-db`).
4.  **Get Connection Info**:
    *   Click "Connect".
    *   Select "Prisma" as the connector.
    *   Copy the `DATABASE_URL`. It will look like:
        `mysql://<user>:<password>@<host>:4000/test?sslaccept=strict`
    *   **Important**: Change `/test` to `/andre_garcia` in the URL.

---

## 🛠 Step 2: Free Backend (Render)

1.  Push your latest code to GitHub.
2.  Go to [Render](https://render.com/) and Sign Up.
3.  Click **"New +"** -> **"Web Service"**.
4.  Connect your GitHub repository.
5.  **Configuration**:
    *   **Name**: `ag-website-backend`
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npx prisma generate`
    *   **Start Command**: `node server.js`
    *   **Instance Type**: Free
6.  **Environment Variables** (Scroll down to "Advanced"):
    *   Add key: `DATABASE_URL` | Value: (Your TiDB URL from Step 1)
    *   Add key: `JWT_SECRET` | Value: (Random long string)
    *   Add key: `ADMIN_USERNAME` | Value: `admin`
    *   Add key: `ADMIN_PASSWORD` | Value: (Your secure password)
    *   Add key: `EMAIL_USER` | Value: (Your Gmail)
    *   Add key: `EMAIL_PASS` | Value: (Your Gmail App Password)
    *   Add key: `EMAIL_FROM` | Value: `Andre Garcia <your-email@gmail.com>`
    *   Add key: `EMAIL_TO` | Value: `sarafpriyanshu09@gmail.com`
    *   Add key: `RAZORPAY_KEY_ID` | Value: (Your Razorpay Key)
    *   Add key: `RAZORPAY_KEY_SECRET` | Value: (Your Razorpay Secret)
    *   Add key: `PORT` | Value: `10000` (Render default, or let it auto-detect)
7.  **Deploy Web Service**.
8.  Wait for it to go live. Copy the **Service URL** (e.g., `https://ag-website-backend.onrender.com`).

---

## 🛠 Step 3: Database Setup (Run Migrations)

Since Render's free tier doesn't easily let us run one-off commands via CLI, we will use your **local machine** to push the schema to the remote database.

1.  On your computer, open `backend/.env`.
2.  Temporarily replace `DATABASE_URL` with your **TiDB Cloud URL**.
3.  Run:
    ```bash
    cd backend
    npx prisma db push
    # Optional: Seed data
    npm run db:seed
    ```
4.  (Revert your local `.env` to localhost if you want to keep developing locally).

---

## 🛠 Step 4: Free Frontend (Vercel)

1.  Go to [Vercel](https://vercel.com/).
2.  **Add New Project** -> Import your GitHub Repo.
3.  **Project Settings**:
    *   **Root Directory**: Edit -> Select `frontend`.
    *   **Framework**: Next.js.
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Your Render Backend URL + `/api` (e.g., `https://ag-website-backend.onrender.com/api`).
    *   `NEXTAUTH_URL`: The Vercel domain (e.g., `https://your-app.vercel.app`).
    *   `NEXTAUTH_SECRET`: (Same random string as backend).
5.  **Deploy**.

---

## 🔗 Step 5: Final Connection

1.  Go back to **Render Dashboard** -> Environment Variables.
2.  Add `FRONTEND_URL` = `https://your-app.vercel.app` (Your new Vercel domain).
3.  **Manual Redeploy** (or it might auto-deploy) to apply the CORS change.

## 🎉 You are live!

**Summary of Free Tier Limits:**
*   **Render**: Spins down after 15 mins of inactivity. First request after a while will take ~30s to load (Cold Start).
*   **TiDB**: 5GB Storage (Plenty for e-commerce).
*   **Vercel**: Fast and reliable.
