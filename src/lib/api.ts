import axios from 'axios';

// Use environment variable or fallback to production backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tizii-backend.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for Render cold starts
  withCredentials: false,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network Error - Server might be down:', error.message);
      error.message = 'Cannot connect to server. Please ensure the backend is running at ' + API_BASE_URL;
    }
    return Promise.reject(error);
  }
);

// ---------------- Auth Endpoints ----------------
export const authApi = {
  signup: (data: { full_name: string; email: string; password: string; role?: string }) =>
    api.post('/api/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  createStudioOwner: (data: { full_name: string; email: string; phone?: string; password: string }) =>
    api.post('/api/auth/create-studio-owner', data),
  createStudioManager: (data: { full_name: string; email: string; phone?: string; password: string }) =>
    api.post('/api/auth/create-studio-manager', data),
  createStudioStaff: (data: { full_name: string; email: string; phone?: string; password: string }) =>
    api.post('/api/auth/create-studio-staff', data),
};

// ---------------- Studios Endpoints ----------------
export interface StudioPayload {
  name: string;
  location?: string;
  description?: string;
  owner_id?: string;
  amenities?: string[];
  timezone?: string;
}

export const studiosApi = {
  getAll: () => api.get("/api/studios"),
  getById: (id: string) => api.get(`/api/studios/${id}`),
  getRooms: (studioId: string) => api.get(`/api/studios/${studioId}/rooms`),
  create: (data: FormData | StudioPayload) => {
    if (data instanceof FormData) {
      return api.post("/api/studios", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post("/api/studios", data);
  },
  update: (id: string, data: FormData | StudioPayload) => {
    if (data instanceof FormData) {
      return api.patch(`/api/studios/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.patch(`/api/studios/${id}`, data);
  },
  delete: (id: string) => api.delete(`/api/studios/${id}`),
};


// ---------------- Bookings Endpoints ----------------
export interface BookingSlot {
  start_time: string;
  end_time: string;
}

export interface CreateBookingPayload {
  studio_id: string;
  room_id?: string;
  slots: BookingSlot[];
  payment_method: "online" | "offline";
  phone_number?: string;
  currency?: string;
  notes?: string;
}

export const bookingsApi = {
  getAll: () => api.get('/api/bookings'),
  getById: (id: string) => api.get(`/api/bookings/${id}`),
  create: (data: CreateBookingPayload) => api.post('/api/bookings', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/api/bookings/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/api/bookings/${id}`),
};

// ---------------- Payments Endpoints ----------------
export const paymentsApi = {
  initiate: (data: { booking_id: string; phone_number: string }) =>
    api.post('/api/payments/initiate', data),
  checkStatus: (id: string) => api.get(`/api/payments/${id}/status`),
};

// ---------------- User Endpoints ----------------
export const usersApi = {
  updateProfile: (userId: string, data: FormData) => 
    api.patch(`/api/users/${userId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  checkEmailUnique: (email: string) => 
    api.get(`/api/users/check-email?email=${encodeURIComponent(email)}`),
};
