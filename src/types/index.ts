export interface User {
  id: number;
  email: string;
  name: string;
  role: 'receptionist' | 'doctor';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  medical_history: string;
  current_medication: string;
  allergies: string;
  emergency_contact: string;
  blood_group: string;
  insurance_number: string;
  registered_by: number;
  registered_by_user?: User;
  last_updated_by: number;
  last_updated_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}