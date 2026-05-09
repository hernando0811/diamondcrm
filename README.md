# DiamondCRM

DiamondCRM is a PERN stack customer relationship management system built for small service businesses. It helps a business owner manage customers, track service jobs, view customer history, and monitor dashboard stats.

## Tech Stack

- PostgreSQL
- Express.js
- React
- Node.js
- Axios
- Vite

---

## Recreating the Database on Another Machine

To move DiamondCRM to another machine, you need to recreate the PostgreSQL database and run the database schema file.

### 1. Create the database

Open PostgreSQL:

```bash
sudo -u postgres psql
```

Inside PostgreSQL, run:

```sql
CREATE DATABASE diamondcrm;
\q
```

### 2. Run the schema file

From the project's `server` folder, run:

```bash
cd server
sudo -u postgres psql -d diamondcrm -f db/schema.sql
```

This will create the main DiamondCRM database tables:

- `customers`
- `jobs`
- `users`

It will also create indexes and the foreign key relationship between customers and jobs.

---

## Backend Setup

Go into the backend folder:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
nano .env
```

Example `.env`:

```env
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=diamondcrm
DB_PASSWORD=your_password_here
DB_PORT=5432

JWT_SECRET=replace_this_with_a_long_random_secret
```

Run the backend in development mode:

```bash
npm run dev
```

Run the backend normally:

```bash
npm start
```

The backend should run on:

```text
http://localhost:5000
```

---

## Backend Scripts

The backend `server/package.json` should include:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

Backend dependencies:

- `express`
- `pg`
- `dotenv`
- `cors`
- `bcrypt`
- `jsonwebtoken`

Backend dev dependency:

- `nodemon`

---

## Frontend Setup

Go into the frontend folder:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

Build the frontend for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Frontend Scripts

The frontend `client/package.json` should include scripts similar to:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

Frontend dependencies include:

- `react`
- `react-dom`
- `axios`
- `react-router-dom`

---

## Backend File Overview

### `server.js`

The main backend file connects:

- Express
- CORS
- JSON middleware
- PostgreSQL database connection
- Customer routes
- Job routes
- Dashboard routes

Mounted routes:

```js
app.use("/api/customers", customerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
```

Test routes:

```text
GET /
GET /api/test-db
```

---

## Customer Controller

File:

```text
server/controllers/customerController.js
```

Functions:

```text
getCustomers
getCustomerById
createCustomer
updateCustomer
deleteCustomer
searchCustomers
```

Customer API routes:

```text
GET    /api/customers
GET    /api/customers/search?query=value
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

Customer search supports:

- First name
- Last name
- Full name
- Email
- Phone number

Search uses PostgreSQL `ILIKE`, so it is case-insensitive.

Example:

```text
/api/customers/search?query=celina
/api/customers/search?query=Celina
/api/customers/search?query=704
```

---

## Job Controller

File:

```text
server/controllers/jobController.js
```

Functions:

```text
getJobs
getJobById
getJobsByCustomer
createJob
updateJob
deleteJob
```

Job API routes:

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
GET    /api/customers/:customerId/jobs
```

Important relationship:

```sql
customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE
```

This means:

- Each job belongs to one customer.
- One customer can have many jobs.
- If a customer is deleted, that customer's jobs are also deleted.

---

## Dashboard Controller

File:

```text
server/controllers/dashboardController.js
```

Function:

```text
getDashboardStats
```

Dashboard API route:

```text
GET /api/dashboard/stats
```

The dashboard calculates:

- Total customers
- Total jobs
- Pending jobs
- Scheduled jobs
- Completed jobs
- Estimated revenue
- Completed revenue

---

## API Route Summary

### Customers

```text
GET    /api/customers
GET    /api/customers/search?query=value
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
GET    /api/customers/:customerId/jobs
```

### Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Dashboard

```text
GET /api/dashboard/stats
```

---

## Running the Full App

You need two terminals.

### Terminal 1: Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Terminal 2: Frontend

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```
