export interface User {
  id: number;
  username: string;
  email: string;
  profileUrl?: string;
  createdAt: string;
  updatedAt: string;
  Stores?: Store[];
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

export interface UserResponse {
  status: number;
  message?: string;
  user: User;
}

export interface StoresResponse {
  status: number;
  store?: Store[];
  stores?: Store;
  message?: string;
}

export interface GroceriesResponse {
  status: number;
  groceries?: Grocery[];
  grocery?: Grocery;
  message?: string;
}

export interface TransactionResponse {
  status: number;
  transactions?: Transaction[];
  transaction?: Transaction;
  message?: string;
}

export interface StatisticsResponse {
  status: number;
  message?: string;
  statistics: Statistics;
}

export interface PresignedUrlResponse {
  status: number;
  message: string;
  uploadUrl: string;
  imageUrl?: string;
  publicUrl?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: string;
  services: {
    server: { status: string };
    database: { status: string; latencyMs?: number };
    storage: { status: string; bucket?: string };
  };
}

export interface GoogleJwtPayload {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}
