# Nova Hackathon Registration Portal (Web App)

Welcome to the **Nova** Next.js web application. This directory houses the complete frontend and API logic for the Nova platform landing page and the Hackathon Registration portal.

---

## 🚀 Key Features

- **Premium UI/UX**: Built with a sleek dark theme, glassmorphism, responsive grids, and clean layout flow.
- **Form Validation**: Multi-member registration form controlled with `react-hook-form` and validated using `zod`.
- **API Endpoint**: Serverless Next.js route (`/api/register`) handling form inputs, checking for existing teams in MongoDB, inserting documents, and triggering emails.
- **Middleware Rate Limiting**: An IP-based rate limiting system using Upstash Redis to prevent spam registration requests.
- **Email Notification**: Automated HTML verification emails delivered to the team leader via Mailtrap.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **State & UI**: React 19, Radix UI primitives, Lucide Icons
- **Styling**: Tailwind CSS v4 (configured with PostCSS)
- **Database**: MongoDB
- **Caching/Rate Limit**: Upstash Redis
- **Mailing**: Mailtrap

---

## ⚙️ Development & Setup

### 1. Install dependencies
From this directory, run:
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in this directory and populate it with the following configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hackathon?retryWrites=true&w=majority

# Mailtrap Transactional Email Config
MAILTRAP_TOKEN=your_mailtrap_api_token
MAILTRAP_SENDER_EMAIL=your_sender_email@yourdomain.com

# Upstash Redis Credentials
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### 3. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it.

### 4. Build and Run Production Build
```bash
npm run build
npm run start
```
