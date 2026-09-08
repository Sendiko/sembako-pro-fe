# Penghitung Sembako REST API Documentation

A comprehensive, developer-friendly API reference for building web and mobile frontends for **Penghitung Sembako** (Grocery Inventory & Point of Sale API).

---

## 🚀 Quick Overview

- **Base URL**: `https://sembako.sendiko.my.id/` (Production)
- **Local Dev Base URL**: `http://localhost:3000/`
- **Default Content-Type**: `application/json`
- **File Upload Content-Type**: `multipart/form-data` or via S3 Presigned URLs

---

## 📐 Entity Relationship Architecture

```
User (1) ───< Store (N) ───< Grocery (N) ─── (1:1) ─── Stock
                                │
                                └───< Transaction (N)
```

1. **User**: Account holder owning multiple stores.
2. **Store**: Individual grocery shop owned by a user.
3. **Grocery**: Item catalog belonging to a specific `storeId`.
4. **Stock**: 1:1 inventory record tracking remaining quantity for each `groceryId`.
5. **Transaction**: POS transaction record tracking quantity sold, automatically updating stock levels.

---

## TypeScript Type Definitions for Frontend

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  profileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: number;
  userId: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  quantity: number;
}

export interface Grocery {
  id: number;
  storeId: number;
  name: string;
  unit: string;
  price: number;
  imageUrl?: string;
  stock?: Stock;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  storeId: number;
  groceryId: number;
  amount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  Grocery?: Pick<Grocery, "id" | "name">;
}

export interface Statistics {
  groceryCount: number;
  totalSales: number;
  totalHistory: number;
}
```

---

## 🛠 Standard API Response Wrappers

### Success Response Format
```json
{
  "status": 200,
  "message": "Optional descriptive message",
  "data_key": {} // user | store | grocery | transactions | statistics
}
```

### Error Response Format
```json
{
  "status": 400 | 404 | 500,
  "message": "Error message description",
  "error": "Detailed error string if applicable"
}
```

---

## 📚 API Endpoint Reference

### 1. User API (`/user`)

#### `GET /user/:id`
Retrieves user profile details.
- **Path Parameter**: `id` (number, required) - User ID.
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "user": {
      "id": 3,
      "username": "Rizky Sendiko",
      "email": "sendiko@example.com",
      "profileUrl": "https://example.com/profile.jpg",
      "createdAt": "2025-05-27T17:24:39.000Z",
      "updatedAt": "2025-05-27T17:24:39.000Z"
    }
  }
  ```

#### `POST /user`
Creates a new user account.
- **Request Body (JSON)**:
  ```json
  {
    "username": "Sendiko",
    "email": "sendiko@example.com",
    "profileUrl": "https://example.com/profile.jpg"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": 201,
    "message": "User created successfully",
    "user": {
      "id": 8,
      "username": "Sendiko",
      "email": "sendiko@example.com",
      "profileUrl": "https://example.com/profile.jpg",
      "createdAt": "2025-06-08T15:37:54.199Z",
      "updatedAt": "2025-06-08T15:37:54.199Z"
    }
  }
  ```

---

### 2. Store API (`/store`)

#### `GET /store/:userId`
Retrieves all stores owned by a specific user.
- **Path Parameter**: `userId` (number, required) - User ID.
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "store": [
      {
        "id": 1,
        "userId": 3,
        "name": "Toko Sembako Jaya",
        "address": "Jl. Merdeka No. 123",
        "phone": "081234567890",
        "email": "toko1@example.com",
        "createdAt": "2025-05-27T17:24:39.000Z",
        "updatedAt": "2025-05-27T17:24:39.000Z"
      }
    ]
  }
  ```

#### `GET /store/details/:id`
Retrieves store information by store ID / user query ID.
- **Path Parameter**: `id` (number, required).
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "stores": {
      "id": 1,
      "userId": 3,
      "name": "Toko Sembako Jaya",
      "address": "Jl. Merdeka No. 123",
      "phone": "081234567890",
      "email": "toko1@example.com",
      "createdAt": "2025-05-27T17:24:39.000Z",
      "updatedAt": "2025-05-27T17:24:39.000Z"
    }
  }
  ```

#### `POST /store`
Creates a new store.
- **Request Body (JSON)**:
  ```json
  {
    "userId": 3,
    "name": "Toko Sembako Jaya",
    "address": "Jl. Merdeka No. 123",
    "phone": "081234567890",
    "email": "toko1@example.com"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": 201,
    "message": "Store created successfully",
    "store": {
      "id": 1,
      "userId": 3,
      "name": "Toko Sembako Jaya",
      "address": "Jl. Merdeka No. 123",
      "phone": "081234567890",
      "email": "toko1@example.com",
      "createdAt": "2025-06-08T15:37:54.199Z",
      "updatedAt": "2025-06-08T15:37:54.199Z"
    }
  }
  ```

#### `PUT /store/:id`
Updates an existing store by store ID.
- **Path Parameter**: `id` (number, required).
- **Request Body (JSON)**:
  ```json
  {
    "name": "Toko Sembako Jaya Updated",
    "address": "Jl. Merdeka No. 124",
    "phone": "081234567891",
    "email": "toko1-updated@example.com"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Store updated successfully",
    "store": {
      "id": 1,
      "userId": 3,
      "name": "Toko Sembako Jaya Updated",
      "address": "Jl. Merdeka No. 124",
      "phone": "081234567891",
      "email": "toko1-updated@example.com",
      "createdAt": "2025-06-08T15:44:15.000Z",
      "updatedAt": "2025-06-08T15:46:23.436Z"
    }
  }
  ```

#### `DELETE /store/:id`
Deletes a store and all linked groceries, stocks, and transactions.
- **Path Parameter**: `id` (number, required).
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Store deleted successfully"
  }
  ```

---

### 3. Grocery API (`/grocery`)

#### `GET /grocery/:storeId`
Retrieves all groceries belonging to a store ID, including stock quantities.
- **Path Parameter**: `storeId` (number, required).
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "groceries": [
      {
        "id": 17,
        "storeId": 1,
        "name": "Beras Raja Platinum",
        "unit": "Kg",
        "price": 19000,
        "imageUrl": "https://sembako.sendiko.my.id/public/groceries/1749017019124-beras.jpg",
        "createdAt": "2025-05-30T08:30:33.000Z",
        "updatedAt": "2025-06-04T06:03:39.000Z",
        "stock": {
          "quantity": 50
        }
      }
    ]
  }
  ```

#### `GET /grocery/details/:id`
Retrieves single grocery details by ID.
- **Path Parameter**: `id` (number, required).
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "grocery": {
      "id": 17,
      "storeId": 1,
      "name": "Beras Raja Platinum",
      "unit": "Kg",
      "price": 19000,
      "imageUrl": "https://sembako.sendiko.my.id/public/groceries/1749017019124-beras.jpg",
      "createdAt": "2025-05-30T08:30:33.000Z",
      "updatedAt": "2025-06-04T06:03:39.000Z",
      "stock": {
        "quantity": 50
      }
    }
  }
  ```

#### `POST /grocery`
Creates a grocery item and initializes stock quantity.
- **Request Body (JSON or Form-Data)**:
  - `storeId` (number, required)
  - `name` (string, required)
  - `unit` (string, required e.g., "Kg", "Lt", "Pcs")
  - `price` (number, required)
  - `imageUrl` / `image_url` (string, optional URL or file upload)
  - `quantity` (number, optional, default: 0)
- **Response (201 Created)**:
  ```json
  {
    "status": 201,
    "message": "Grocery created successfully",
    "grocery": {
      "id": 24,
      "storeId": 1,
      "name": "Telur Ayam Fresh",
      "unit": "Kg",
      "price": 28000,
      "imageUrl": "https://sembako.sendiko.my.id/public/groceries/telur.jpg",
      "createdAt": "2025-06-08T15:44:15.201Z",
      "updatedAt": "2025-06-08T15:44:15.201Z",
      "stock": {
        "quantity": 100
      }
    }
  }
  ```

#### `PUT /grocery/:id`
Updates grocery properties by ID.
- **Path Parameter**: `id` (number, required).
- **Request Body (JSON)**: `storeId`, `name`, `unit`, `price`, `imageUrl`
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Grocery updated successfully",
    "grocery": {
      "id": 24,
      "storeId": 1,
      "name": "Telur Ayam Super",
      "unit": "Kg",
      "price": 29000,
      "imageUrl": "https://sembako.sendiko.my.id/public/groceries/telur.jpg",
      "createdAt": "2025-06-08T15:44:15.000Z",
      "updatedAt": "2025-06-08T15:46:23.436Z"
    }
  }
  ```

#### `DELETE /grocery/:id`
Deletes a grocery item by ID.
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Grocery deleted successfully"
  }
  ```

---

### 4. Stock API (`/grocery/:id/stock`)

#### `PUT /grocery/:id/stock`
Updates stock quantity for a grocery item.
- **Path Parameter**: `id` (number, required) - Grocery ID.
- **Request Body (JSON)**:
  ```json
  {
    "quantity": 75
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Stock updated successfully",
    "grocery": {
      "id": 17,
      "storeId": 1,
      "name": "Beras Raja Platinum",
      "stock": {
        "quantity": 75
      }
    }
  }
  ```

> 💡 **Automatic Stock Adjustments via POS Transactions**:
> - `POST /transaction`: Automatically **decrements** grocery stock.
> - `PUT /transaction/:id`: Adjusts stock based on the delta amount.
> - `DELETE /transaction/:id`: Restores (increments) stock quantity.

---

### 5. Transaction API (`/transaction`)

#### `GET /transaction/:storeId`
Retrieves sales transactions for a store ID.
- **Path Parameter**: `storeId` (number, required).
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "transactions": [
      {
        "id": 6,
        "storeId": 1,
        "groceryId": 17,
        "amount": 15,
        "totalPrice": 285000,
        "createdAt": "2025-05-30T09:15:20.000Z",
        "updatedAt": "2025-05-30T09:15:20.000Z",
        "Grocery": {
          "id": 17,
          "name": "Beras Raja Platinum"
        }
      }
    ]
  }
  ```

#### `POST /transaction`
Creates a transaction (POS sale) and automatically deducts stock.
- **Request Body (JSON)**:
  ```json
  {
    "storeId": 1,
    "groceryId": 17,
    "amount": 2,
    "totalPrice": 38000
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": 201,
    "message": "Transaction successfully created.",
    "transaction": {
      "id": 14,
      "storeId": 1,
      "groceryId": 17,
      "amount": 2,
      "totalPrice": 38000,
      "createdAt": "2025-06-08T15:50:00.000Z",
      "updatedAt": "2025-06-08T15:50:00.000Z"
    }
  }
  ```

---

### 6. Statistics & Presigned Upload API

#### `GET /stats/:userId`
Retrieves total sales, total transactions, and grocery count for dashboard widgets.
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Grocery count retrieved successfully",
    "statistics": {
      "groceryCount": 5,
      "totalSales": 1090000,
      "totalHistory": 6
    }
  }
  ```

#### `POST /upload/presigned-url`
Generates a signed MinIO/S3 URL for direct client-side file uploading.
- **Request Body (JSON)**:
  ```json
  {
    "fileName": "my-item.jpg"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Presigned URL generated successfully",
    "uploadUrl": "https://sembako.sendiko.my.id/public/groceries/my-item.jpg?presigned...",
    "imageUrl": "https://sembako.sendiko.my.id/public/groceries/my-item.jpg"
  }
  ```

#### `GET /test`
Server health check monitoring endpoint.
- **Browser View**: Serves interactive HTML health monitoring dashboard.
- **API Call (`GET /test?format=json`)**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-09T09:35:10.000Z",
    "uptime": "12m 45s",
    "services": {
      "server": { "status": "UP" },
      "database": { "status": "UP", "latencyMs": 14 },
      "storage": { "status": "UP", "bucket": "groceries" }
    }
  }
  ```

---

## 🔑 Google OAuth Login / Registration Frontend Integration Guide

The **Penghitung Sembako API** features a streamlined, idempotent user onboarding flow (`POST /user`). When a user signs in with Google on the web frontend:
1. If the email **does not exist**, the API creates a new user record (HTTP 201).
2. If the email **already exists**, the API logs in the user and returns their profile with all owned stores (HTTP 200).

### Sequence Diagram

```
User (Browser)               Frontend App              Google OAuth              Backend API
      │                           │                         │                         │
      │─── Click "Sign in" ──────>│                         │                         │
      │                           │─── Request OAuth ──────>│                         │
      │                           │<── Return ID Token/User ┤                         │
      │                           │    (email, name, picture)                         │
      │                           │                                                   │
      │                           │───────────── POST /user ─────────────────────────>│
      │                           │   { username, email, profileUrl }                 │
      │                           │                                                   │
      │                           │<──────────── Return User Data + Stores ───────────┤
      │                           │              (200 OK / 201 Created)               │
      │<── Navigate to Dashboard ─┤                                                   │
```

---

### Option A: React / Next.js Implementation (using `@react-oauth/google`)

#### 1. Installation
```bash
npm install @react-oauth/google jwt-decode
```

#### 2. Wrap Application in `GoogleOAuthProvider`
```tsx
// main.tsx or App.tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
      <YourAppRoutes />
    </GoogleOAuthProvider>
  );
}
```

#### 3. Implement Login Component
```tsx
// components/GoogleLoginButton.tsx
import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
}

export const GoogleLoginButton = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    // 1. Decode Google ID token to extract profile info
    const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

    try {
      // 2. Send profile details to API
      const res = await fetch('https://sembako.sendiko.my.id/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: decoded.name,
          email: decoded.email,
          profileUrl: decoded.picture,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // data.user contains { id, username, email, profileUrl, Stores: [...] }
        console.log('Login successful:', data.user);
        
        // 3. Save user session to localStorage / Auth Context
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        console.error('API Login Error:', data.message);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Google Login Failed')}
      useOneTap
    />
  );
};
```

---

### Option B: Vanilla HTML / JavaScript Implementation (Google Identity Services)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
  <!-- Google Sign-In Button Container -->
  <div id="g_id_onload"
       data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
       data-callback="handleCredentialResponse">
  </div>
  <div class="g_id_signin" data-type="standard"></div>

  <script>
    function parseJwt (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    }

    async function handleCredentialResponse(response) {
      const googleUser = parseJwt(response.credential);

      const apiResponse = await fetch('https://sembako.sendiko.my.id/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: googleUser.name,
          email: googleUser.email,
          profileUrl: googleUser.picture
        })
      });

      const data = await apiResponse.json();
      if (data.user) {
        alert('Welcome back, ' + data.user.username + '!');
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      }
    }
  </script>
</body>
</html>
```

---

### Session Persistence & Store Context Advice for Frontend

1. **Active Store Selection**:
   - The user payload returned by `POST /user` includes a `Stores` array containing all stores owned by the user: `data.user.Stores`.
   - If `data.user.Stores` is empty (`[]`), redirect the user to a **"Create Your First Store"** modal (`POST /store`).
   - If `data.user.Stores` has items, automatically select `Stores[0].id` as the active `storeId` for fetching groceries and recording POS transactions.

2. **Session Storage Recommendation**:
   ```typescript
   // Save on login
   localStorage.setItem("user", JSON.stringify(user));
   localStorage.setItem("activeStoreId", String(user.Stores[0]?.id));

   // Restore on app mount
   const currentUser = JSON.parse(localStorage.getItem("user") || "null");
   const activeStoreId = localStorage.getItem("activeStoreId");
   ```

---

## 💻 Frontend API Service Template (TypeScript Fetch)

Here is a ready-to-copy API service helper for your frontend project:

```typescript
const BASE_URL = "https://sembako.sendiko.my.id";

export const api = {
  async getStores(userId: number) {
    const res = await fetch(`${BASE_URL}/store/${userId}`);
    return res.json();
  },

  async getGroceries(storeId: number) {
    const res = await fetch(`${BASE_URL}/grocery/${storeId}`);
    return res.json();
  },

  async updateStock(groceryId: number, quantity: number) {
    const res = await fetch(`${BASE_URL}/grocery/${groceryId}/stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },

  async createTransaction(storeId: number, groceryId: number, amount: number, totalPrice: number) {
    const res = await fetch(`${BASE_URL}/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, groceryId, amount, totalPrice }),
    });
    return res.json();
  },

  async getStats(userId: number) {
    const res = await fetch(`${BASE_URL}/stats/${userId}`);
    return res.json();
  }
};
```

---

## 🎨 Recommended Web Frontend Stack

When building the web frontend for this API, the following stack is recommended:
- **Framework**: Next.js 14+ (App Router) or Vite + React
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query) for fetching & caching API data
- **Icons**: Lucide React
