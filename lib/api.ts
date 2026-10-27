import {
  UserResponse,
  StoresResponse,
  GroceriesResponse,
  TransactionResponse,
  StatisticsResponse,
  PresignedUrlResponse,
  HealthCheckResponse,
  Store,
  Grocery,
} from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://sembako.sendiko.my.id";

async function getResponseError(res: Response, fallback: string): Promise<Error> {
  const body: unknown = await res.json().catch(() => null);
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return new Error(body.message);
  }
  return new Error(fallback);
}

export const api = {
  // User API
  async getUser(id: number): Promise<UserResponse> {
    const res = await fetch(`${BASE_URL}/user/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
    return res.json();
  },

  async syncUser(userData: {
    username: string;
    email: string;
    profileUrl?: string;
  }): Promise<UserResponse> {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create/login user`);
    }
    return res.json();
  },

  // Store API
  async getStoresByUser(userId: number): Promise<StoresResponse> {
    const res = await fetch(`${BASE_URL}/store/${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch stores: ${res.statusText}`);
    return res.json();
  },

  async getStoreDetails(id: number): Promise<StoresResponse> {
    const res = await fetch(`${BASE_URL}/store/details/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch store details`);
    return res.json();
  },

  async createStore(storeData: {
    userId: number;
    name: string;
    address: string;
    phone: string;
    email?: string;
  }): Promise<StoresResponse> {
    const res = await fetch(`${BASE_URL}/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(storeData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create store`);
    }
    return res.json();
  },

  async updateStore(
    id: number,
    storeData: Partial<Omit<Store, "id" | "userId">>
  ): Promise<StoresResponse> {
    const res = await fetch(`${BASE_URL}/store/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(storeData),
    });
    if (!res.ok) throw new Error(`Failed to update store`);
    return res.json();
  },

  async deleteStore(id: number): Promise<{ status: number; message: string }> {
    const res = await fetch(`${BASE_URL}/store/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete store`);
    return res.json();
  },

  // Grocery API
  async getGroceries(storeId: number): Promise<GroceriesResponse> {
    const res = await fetch(`${BASE_URL}/grocery/${storeId}`);
    if (!res.ok) throw new Error(`Failed to fetch groceries`);
    return res.json();
  },

  async getGroceryDetails(id: number): Promise<GroceriesResponse> {
    const res = await fetch(`${BASE_URL}/grocery/details/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch grocery details`);
    return res.json();
  },

  async createGrocery(groceryData: {
    storeId: number;
    name: string;
    unit: string;
    price: number;
    imageUrl?: string;
    quantity?: number;
  }): Promise<GroceriesResponse> {
    const res = await fetch(`${BASE_URL}/grocery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groceryData),
    });
    if (!res.ok) throw await getResponseError(res, "Failed to create grocery item");
    return res.json();
  },

  async updateGrocery(
    id: number,
    groceryData: Partial<Omit<Grocery, "id" | "stock">>
  ): Promise<GroceriesResponse> {
    const res = await fetch(`${BASE_URL}/grocery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groceryData),
    });
    if (!res.ok) throw await getResponseError(res, "Failed to update grocery item");
    return res.json();
  },

  async deleteGrocery(id: number): Promise<{ status: number; message: string }> {
    const res = await fetch(`${BASE_URL}/grocery/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete grocery item`);
    return res.json();
  },

  // Stock API
  async updateStock(
    groceryId: number,
    quantity: number
  ): Promise<GroceriesResponse> {
    const res = await fetch(`${BASE_URL}/grocery/${groceryId}/stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error(`Failed to update stock`);
    return res.json();
  },

  // Transaction API
  async getTransactions(storeId: number): Promise<TransactionResponse> {
    const res = await fetch(`${BASE_URL}/transaction/${storeId}`);
    if (!res.ok) throw new Error(`Failed to fetch transactions`);
    return res.json();
  },

  async createTransaction(transactionData: {
    storeId: number;
    groceryId: number;
    amount: number;
    totalPrice: number;
  }): Promise<TransactionResponse> {
    const res = await fetch(`${BASE_URL}/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    });
    if (!res.ok) throw new Error(`Failed to create transaction`);
    return res.json();
  },

  // Statistics API
  async getStats(userId: number): Promise<StatisticsResponse> {
    const res = await fetch(`${BASE_URL}/stats/${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch statistics`);
    return res.json();
  },

  // File Upload API
  async getPresignedUrl(fileName: string): Promise<PresignedUrlResponse> {
    const res = await fetch(`${BASE_URL}/upload/presigned-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    });
    if (!res.ok) throw await getResponseError(res, "Failed to generate presigned upload URL");
    return res.json();
  },

  async uploadImage(file: File): Promise<string> {
    const { uploadUrl, imageUrl, publicUrl } = await api.getPresignedUrl(file.name);
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw await getResponseError(res, `Failed to upload image: ${res.statusText}`);
    const uploadedImageUrl = publicUrl ?? imageUrl;
    if (!uploadedImageUrl) throw new Error("The upload service did not return an image URL.");
    return uploadedImageUrl;
  },

  // Health check API
  async checkHealth(): Promise<HealthCheckResponse> {
    const res = await fetch(`${BASE_URL}/test?format=json`);
    if (!res.ok) throw new Error(`Health check request failed`);
    return res.json();
  },
};
