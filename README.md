# 🛒 E-Commerce Frontend

A modern and responsive **full-stack e-commerce frontend** built with **React, Vite, Redux Toolkit, Material UI, Tailwind CSS, Axios, and React Hook Form**.

The application provides separate interfaces for **Admin, Seller, and Customer** users and communicates with a Laravel 12 REST API backend.

---

## 🌐 Live Application

**Production Frontend:**

https://ecommerce-frontend-nine-blue.vercel.app/

**Production Backend API:**

https://ecommerce-backend-production-2736.up.railway.app/

---

## 📌 Project Overview

This React application is the frontend of a full-stack multi-role e-commerce platform.

It provides a complete user interface for managing products, sellers, customers, shopping carts, wishlists, orders, inventory, coupons, reviews, addresses, and other e-commerce functionality.

The frontend communicates with a separate **Laravel 12 REST API backend** using Axios.

### User Roles

* **Admin**
* **Seller**
* **Customer**

Each role has its own dashboard and features based on authentication and permissions.

---

## ✨ Key Features

### 🔐 Authentication

* User registration
* User login
* User logout
* Protected routes
* Role-based navigation
* Authentication state management
* API authentication
* Persistent login state
* Unauthorized access handling

### 👨‍💼 Admin Dashboard

Administrators can manage the overall e-commerce platform.

Features include:

* Dashboard
* User management
* Seller management
* Seller approval
* Product management
* Category management
* Brand management
* Inventory management
* Order management
* Coupon management
* Vendor management
* Reports
* Platform settings

### 🏪 Seller Dashboard

Sellers can manage their products and business-related information.

Features include:

* Seller dashboard
* Product CRUD
* Product images
* Product variants
* Product pricing
* Product stock
* Inventory management
* Order management
* Seller information

### 🛍️ Customer Shopping

Customers can:

* Browse products
* Search products
* Filter products
* Sort products
* View product details
* Select product variants
* Add products to cart
* Update cart quantities
* Remove cart items
* Add products to wishlist
* Place orders
* View order history
* Track order status
* Manage addresses
* Apply coupons
* Submit product reviews

---

## 🔎 Product Search & Filtering

The frontend supports:

* Product search
* Category filtering
* Brand filtering
* Price filtering
* Sorting
* Pagination
* Product variant selection

These features communicate with the Laravel backend APIs.

---

## 🛒 Shopping Cart

Customers can:

* Add products to cart
* Select product variants
* Change product quantities
* Remove products
* View cart totals
* Continue to checkout

Cart state is managed using **Redux Toolkit**.

---

## ❤️ Wishlist

Customers can:

* Add products to wishlist
* Remove products from wishlist
* View wishlist products
* Move between wishlist and product pages

---

## 📦 Orders

The frontend provides interfaces for:

* Creating orders
* Viewing order history
* Viewing order details
* Tracking order status
* Seller order management
* Admin order management
* Order cancellation based on order status

---

## 📊 Inventory Management

Admin and seller interfaces provide inventory functionality including:

* Product stock
* Variant stock
* Inventory quantities
* Inventory updates
* Inventory management tables

---

## 🎟️ Coupons

The customer checkout flow supports coupon functionality.

Admin interfaces provide:

* Create coupons
* Update coupons
* Delete coupons
* Manage coupon information

---

## ⭐ Product Reviews

Customers can:

* Submit product reviews
* Rate products
* View product reviews

---

## 📍 Address Management

Customers can:

* Add addresses
* Edit addresses
* Delete addresses
* Manage shipping addresses
* Select addresses during checkout

---

## 🎨 UI & Responsive Design

The application uses:

* **Material UI (MUI)** for UI components
* **Tailwind CSS** for utility-based styling
* Responsive layouts
* Reusable components
* Dashboard layouts
* Form validation
* Toast notifications
* Icons

The interface is designed to work across desktop and mobile screen sizes.

---

## 🧰 Technology Stack

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| React           | Frontend framework             |
| Vite            | Development and build tool     |
| JavaScript      | Application programming        |
| Redux Toolkit   | Global state management        |
| React Redux     | Redux integration              |
| React Router    | Client-side routing            |
| Axios           | API communication              |
| Material UI     | UI components                  |
| Tailwind CSS    | Styling                        |
| React Hook Form | Form management and validation |
| React Hot Toast | Notifications                  |
| React Icons     | Icons                          |
| jwt-decode      | Token-related client utilities |

### Development Tools

* VS Code
* Git
* GitHub
* npm
* Postman

### Deployment

* Vercel

---

## 🏗️ Frontend Architecture

```text
┌─────────────────────────────────────┐
│          React + Vite App           │
│                                     │
│  Pages                              │
│  Components                         │
│  Layouts                            │
│  Forms                              │
│  Protected Routes                   │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          Redux Toolkit              │
│                                     │
│  Auth                               │
│  Products                           │
│  Cart                               │
│  Wishlist                           │
│  Orders                             │
│  Inventory                          │
│  Admin                              │
│  Seller                             │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│              Axios                  │
│          REST API Requests           │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          Laravel 12 API             │
│              Railway                │
└─────────────────────────────────────┘
```

---

## 🗂️ Frontend Project Structure

```text
ecommerce-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── layouts/
│   │   ├── MainLayout/
│   │   ├── AdminLayout/
│   │   ├── SellerLayout/
│   │   └── CustomerLayout/
│   │
│   ├── pages/
│   │
│   ├── redux/
│   │   ├── slices/
│   │   └── store/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── themes/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## 🔄 API Integration

The frontend communicates with the Laravel backend through REST APIs.

Axios is used for:

* Authentication requests
* Product requests
* Cart requests
* Wishlist requests
* Order requests
* Inventory requests
* Coupon requests
* Review requests
* Address requests
* Admin requests
* Seller requests

### Local API Configuration

Create a `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

For production, the API URL points to the deployed Laravel backend.

---

## 🔑 Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
React Authentication State
 │
 ▼
API Request with Authentication
 │
 ▼
Laravel Sanctum
 │
 ▼
Role & Permission Check
 │
 ├── Admin Dashboard
 ├── Seller Dashboard
 └── Customer Dashboard
```

Protected routes prevent users from accessing pages that are not available to their role.

---

## 📱 Responsive Application

The frontend is designed with responsive layouts for:

* Desktop
* Laptop
* Tablet
* Mobile

Material UI and Tailwind CSS are used together to create reusable and responsive interfaces.

---

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/Asmmujahid/ecommerce-frontend.git
```

Navigate into the project:

```bash
cd ecommerce-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Use the correct URL of your local Laravel backend.

### 4. Start the development server

```bash
npm run dev
```

Vite will normally provide a local URL such as:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## 🔒 Environment & Security

Do **not** commit sensitive environment variables to GitHub.

The `.env` file should remain local and should be included in `.gitignore`.

Example:

```text
.env
node_modules/
dist/
```

Never store passwords, API keys, database credentials, or other secrets directly in source code.

---

## 🚀 Deployment

The frontend is deployed using **Vercel**.

### Production Frontend

https://ecommerce-frontend-nine-blue.vercel.app/

### Backend API

https://ecommerce-backend-production-2736.up.railway.app/

The deployed React application communicates with the production Laravel API.

---

## 🎯 Skills Demonstrated

This project demonstrates practical experience with:

* React
* Vite
* JavaScript
* Redux Toolkit
* React Router
* Axios
* Material UI
* Tailwind CSS
* React Hook Form
* REST API integration
* Authentication
* Role-based access
* Protected routes
* State management
* Responsive UI development
* CRUD interfaces
* E-commerce workflows
* Git
* GitHub
* Vercel deployment

---

## 👩‍💻 Developer

### Asma Mujahid

**Software Engineer | Full Stack Developer**

**Technologies:**

```text
React • JavaScript • Laravel • PHP • MySQL
Redux Toolkit • REST APIs
Material UI • Tailwind CSS
Git • GitHub
```

This project was developed as a portfolio application to demonstrate modern frontend development, API integration, state management, authentication, role-based interfaces, responsive UI development, and production deployment.

---

## 🔗 Related Project

### E-Commerce Backend API

Built separately with:

```text
Laravel 12
PHP
MySQL
Laravel Sanctum
Spatie Permission
REST APIs
```

**Production API:**

https://ecommerce-backend-production-2736.up.railway.app/

---

## ⭐ Portfolio Project

**Live Application:**

https://ecommerce-frontend-nine-blue.vercel.app/

**Frontend Repository:**

https://github.com/Asmmujahid/ecommerce-frontend

**Backend Repository:**

https://github.com/Asmmujahid/ecommerce-backend

---

⭐ **Thank you for visiting this project!**
