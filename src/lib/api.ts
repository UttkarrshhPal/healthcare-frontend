import axios from "axios";
import { LoginRequest, LoginResponse, Patient, User } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Patient API
export const patientApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/patients?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<
      Patient,
      "id" | "created_at" | "updated_at" | "registered_by" | "last_updated_by"
    >
  ): Promise<Patient> => {
    const response = await api.post("/patients", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Patient>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  search: async (query: string): Promise<Patient[]> => {
    const response = await api.get(`/patients/search?q=${query}`);
    return response.data;
  },
};
