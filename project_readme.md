# ABC Pharmacy - Medicine Inventory & Sales Management

A Single Page Application (SPA) designed for **ABC Pharmacy** to manage medicine stock, track expiration dates, dynamically highlight inventory risks, and record sales transactions.

## 📌 Project Purpose

The primary objective of this application is to streamline pharmacy inventory management:

* **Track Medicines**: Monitor available medicines with details including Full Name, Brand, Price, Quantity, Expiry Date, and internal Notes.

* **Proactive Inventory Warnings**:

  * 🔴 **Red Alert**: Highlights medicines expiring within 30 days.

  * 🟡 **Yellow Alert**: Highlights medicines with low stock (quantity less than 10).

* **Record Sales**: Provide an integrated mechanism to record medicine sales and automatically deduct quantities from the live inventory.

* **Instant Search**: Quickly filter and find medicines by name.

## 🛠 Tech Stack

* **Frontend**: React.js (Vite), JavaScript (ES6+), CSS3

* **Backend**: ASP.NET Core 10 Web API

* **Data Storage**: Server-side JSON file persistence (`medicines.json`, `sales.json`)

* **Communication**: RESTful API via Fetch/JSON over HTTP

## 🏛 High-Level Architecture

The solution uses a clean, decoupled client-server architecture:

```
+-------------------------------------------------------------+
|                      React SPA (Frontend)                   |
|  - Inventory Data Grid (with Expiry & Stock warnings)       |
|  - Real-time Name Search                                    |
|  - Add Medicine Form                                        |
|  - Direct Sell Action & Inventory Decrement                 |
+------------------------------+------------------------------+
                               |
                               | REST API (HTTP / JSON)
                               v
+-------------------------------------------------------------+
|               ASP.NET Core Web API (Backend)                |
|  - MedicinesController (GET, POST)                          |
|  - SalesController (POST, GET)                              |
|  - Thread-Safe JSON Storage Service (SemaphoreSlim locking) |
+------------------------------+------------------------------+
                               |
                               | File I/O
                               v
+-------------------------------------------------------------+
|                  Server-Side JSON Storage                   |
|  - medicines.json                                           |
|  - sales.json                                               |
+-------------------------------------------------------------+

```

### Architecture Highlights:

1. **Frontend**: A responsive single-page application. Handles real-time search filtering client-side and interacts with backend APIs. Notes are intentionally excluded from the main grid view as per business rules.

2. **Backend**: An ASP.NET Core Web API exposing endpoints for inventory management and sales records.

3. **Storage Engine**: Data persists directly into server-side JSON files using thread-safe locking (`SemaphoreSlim`) to prevent race conditions during concurrent reads and writes.

## 📸 Screenshots

### 1. Main Dashboard & Inventory Grid

*Shows the medicine grid, status color indicators (Red for expiring, Yellow for low stock), and search bar.*

### 2. Add New Medicine Modal

*Form modal capturing medicine attributes including Notes, Expiry Date, and 2-decimal price.*

### 3. Record Sale Action

*Quick-sell prompt deducting stock and persisting transaction records.*

## 🚀 Getting Started

### Prerequisites

* [.NET 10 SDK](https://dotnet.microsoft.com/?utm_source=gemini)

* [Node.js (v18+) & npm](https://nodejs.org/?utm_source=gemini)

### 1. Start the Backend API

```
cd backend
dotnet restore
dotnet run

```

* The API runs at: `http://localhost:5000`

* Test endpoint: `http://localhost:5000/api/medicines`

### 2. Start the Frontend Application

```
cd frontend
npm install
npm run dev

```

* The React SPA will open at `http://localhost:5173`

## 📋 Medicine Data Attributes

| Field Name | Type | Notes | 
 | ----- | ----- | ----- | 
| **Full Name** | Text | Required; searchable | 
| **Brand** | Text | Required | 
| **Price** | Decimal | 2 decimal places | 
| **Quantity** | Number | Current stock | 
| **Expiry Date** | Date | Triggers red warning if $< 30$ days | 
| **Notes** | Text | Stored on server, hidden from main grid | 
