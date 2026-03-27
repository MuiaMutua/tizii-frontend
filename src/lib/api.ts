import axios from 'axios';

// ---------------- COMPREHENSIVE MOCK DATA ----------------

export const MOCK_STUDIOS = [
  {
    id: "1",
    name: "The Echo Chamber",
    location: "Westlands, Nairobi",
    description: "Nairobi's premier recording studio. SSL 4000E console, isolation booths, world-class acoustics, and an in-house engineer team. Trusted by platinum artists across East Africa.",
    image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&auto=format&fit=crop&q=80",
    ],
    amenities: ["SSL 4000E", "Neumann U87", "Genelec 1032", "Vocal Booth", "WiFi", "Parking", "Kitchenette", "Lounge"],
    rating: 4.9,
    review_count: 128,
    price_per_hour: 3500,
    available: true,
    category: "Recording",
    owner: { name: "Marcus Vane", avatar: "", verified: true },
    rooms_count: 3,
  },
  {
    id: "2",
    name: "Sonic Void Labs",
    location: "Kilimani, Nairobi",
    description: "Boutique studio renowned for analog warmth. Neve 8078 console, vintage tape machines, and a curated collection of rare microphones for authentic sonic character.",
    image_url: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559732781-af5e2982d5bf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520529612661-8270562e3640?w=800&auto=format&fit=crop&q=80",
    ],
    amenities: ["Neve 8078", "Ampex ATR-102", "Studer A827", "Grand Piano", "Drum Room"],
    rating: 4.8,
    review_count: 94,
    price_per_hour: 4800,
    available: true,
    category: "Analog",
    owner: { name: "Elena Rossi", avatar: "", verified: true },
    rooms_count: 2,
  },
  {
    id: "3",
    name: "Prism Audio",
    location: "Karen, Nairobi",
    description: "Modern production powerhouse. Fully equipped for mixing, mastering, and multimedia production with Atmos capabilities and cutting-edge monitoring.",
    image_url: "https://images.unsplash.com/photo-1581313729292-697669d67562?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520529612661-8270562e3640?w=800&auto=format&fit=crop&q=80",
    ],
    amenities: ["Apollo x16", "Avid S6", "Dolby Atmos", "Moog One", "Ableton Push 3"],
    rating: 4.7,
    review_count: 67,
    price_per_hour: 3200,
    available: true,
    category: "Production",
    owner: { name: "Kaito Tanaka", avatar: "", verified: false },
    rooms_count: 2,
  },
  {
    id: "4",
    name: "The Concrete Loft",
    location: "Industrial Area, Nairobi",
    description: "Raw, creative, and uncompromised. Large live room with natural reverb, perfect for bands, orchestras, and artists seeking organic acoustic character.",
    image_url: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=800&auto=format&fit=crop&q=80",
    ],
    amenities: ["Live Room 300sqft", "Drum Kit", "Bass Rig", "Guitar Amps", "Baby Grand"],
    rating: 4.6,
    review_count: 51,
    price_per_hour: 2200,
    available: true,
    category: "Live Room",
    owner: { name: "Sarah Jenkins", avatar: "", verified: true },
    rooms_count: 1,
  },
  {
    id: "5",
    name: "Basement Zero",
    location: "Parklands, Nairobi",
    description: "Underground electronic music hub. Modular synthesizer collections, drum machines, and a curated effects console for electronic and experimental artists.",
    image_url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&auto=format&fit=crop&q=80",
    ],
    amenities: ["Eurorack Modular", "TR-909", "TB-303", "Buchla 200e", "Effects Console"],
    rating: 4.9,
    review_count: 43,
    price_per_hour: 2800,
    available: false,
    category: "Electronic",
    owner: { name: "David Bowie Jr.", avatar: "", verified: true },
    rooms_count: 1,
  },
  {
    id: "6",
    name: "Abbey Road East",
    location: "Lavington, Nairobi",
    description: "Inspired by the legendary Abbey Road. Full orchestral recording capabilities, vintage B&K microphones, and a team of classically trained engineers.",
    image_url: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80",
    ],
    amenities: ["Orchestral Room", "B&K Microphones", "Neve 8048", "Live Room 500sqft", "Lounge"],
    rating: 5.0,
    review_count: 22,
    price_per_hour: 6500,
    available: true,
    category: "Orchestral",
    owner: { name: "The Architect", avatar: "", verified: true },
    rooms_count: 3,
  },
];

export const MOCK_ROOMS: Record<string, any[]> = {
  "1": [
    { id: "r1", name: "Control Room A", description: "SSL 4000E console with full patchbay and outboard gear", hourly_rate: 3500, equipment: ["SSL 4000E", "Neumann U87", "Focal SM9", "1176", "LA-2A"], capacity: 6, photos: [] },
    { id: "r2", name: "Vocal Suite", description: "Acoustic isolation booth with vintage mic collection", hourly_rate: 2000, equipment: ["Neumann U67", "API 512C", "Retro Powerstrip"], capacity: 2, photos: [] },
    { id: "r3", name: "Tracking Room", description: "Large live room, 400sqft with natural reverb tail", hourly_rate: 2800, equipment: ["Drum Kit", "Guitar Amp", "Bass Amp", "DI Boxes"], capacity: 8, photos: [] },
  ],
  "2": [
    { id: "r4", name: "Main Console", description: "Neve 8078 with full analog chain and tape machine", hourly_rate: 5000, equipment: ["Neve 8078", "Ampex ATR-102", "Pultec EQP-1A"], capacity: 4, photos: [] },
    { id: "r5", name: "Piano Room", description: "Steinway Model D with live chamber reverb", hourly_rate: 3500, equipment: ["Steinway Model D", "U47 Stereo Pair", "Chandler TG2"], capacity: 6, photos: [] },
  ],
  "3": [
    { id: "r6", name: "Production Suite A", description: "Full Atmos mixing with reference-grade monitoring", hourly_rate: 3500, equipment: ["Apollo x16", "Avid S6", "Genelec Atmos 9.1"], capacity: 3, photos: [] },
    { id: "r7", name: "Synthesis Lab", description: "Electronic production with modular and outboard synths", hourly_rate: 2800, equipment: ["Moog One", "Prophet-6", "TB-303", "TR-808"], capacity: 2, photos: [] },
  ],
  "4": [
    { id: "r8", name: "Live Hall", description: "300sqft live room with natural concrete reverb, great for bands", hourly_rate: 2200, equipment: ["Ludwig Drum Kit", "Fender Bassman", "Marshall JCM800", "Baby Grand"], capacity: 10, photos: [] },
  ],
  "5": [
    { id: "r9", name: "Modular Den", description: "Curated Eurorack modular system with TR and TB classics", hourly_rate: 2800, equipment: ["Eurorack 104hp", "Buchla 200e", "TR-909", "TB-303", "Roland MC-8"], capacity: 2, photos: [] },
  ],
  "6": [
    { id: "r10", name: "Grand Hall", description: "500sqft orchestral room with variable acoustics panels", hourly_rate: 7000, equipment: ["B&K 4006", "Schoeps CMC6", "Neve 8048", "Studer A820"], capacity: 30, photos: [] },
    { id: "r11", name: "Chamber Suite", description: "Intimate room for string quartet, woodwinds, or solo artists", hourly_rate: 4500, equipment: ["AKG C414 Array", "Prism Sound Atlas", "Focal SM9"], capacity: 6, photos: [] },
    { id: "r12", name: "Studio C", description: "Compact mixing suite, perfect for post-production work", hourly_rate: 3000, equipment: ["Avid S1", "Focal Twin6", "Apollo 8 Quad"], capacity: 2, photos: [] },
  ],
};

export const MOCK_BOOKINGS = [
  {
    id: "b1",
    studio_id: "1",
    room_id: "r1",
    studios: { name: "The Echo Chamber", location: "Westlands, Nairobi", image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80" },
    rooms: { name: "Control Room A" },
    start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 2 + 14400000).toISOString(),
    status: "confirmed",
    total_price: 14000,
    artist: { full_name: "Artist One" },
    transaction_id: "#TXN-90821",
  },
  {
    id: "b2",
    studio_id: "2",
    room_id: "r4",
    studios: { name: "Sonic Void Labs", location: "Kilimani, Nairobi", image_url: "https://images.unsplash.com/photo-1559732781-af5e2982d5bf?w=400&auto=format&fit=crop&q=80" },
    rooms: { name: "Main Console" },
    start_time: new Date(Date.now() - 86400000 * 3).toISOString(),
    end_time: new Date(Date.now() - 86400000 * 3 + 7200000).toISOString(),
    status: "completed",
    total_price: 10000,
    artist: { full_name: "Artist One" },
    transaction_id: "#TXN-90820",
  },
  {
    id: "b3",
    studio_id: "6",
    room_id: "r10",
    studios: { name: "Abbey Road East", location: "Lavington, Nairobi", image_url: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&auto=format&fit=crop&q=80" },
    rooms: { name: "Grand Hall" },
    start_time: new Date(Date.now() + 86400000 * 7).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 7 + 10800000).toISOString(),
    status: "pending",
    total_price: 21000,
    artist: { full_name: "Artist One" },
    transaction_id: "#TXN-90819",
  },
];

export const MOCK_TRANSACTIONS = [
  { id: "#TXN-90821", entity: "THE ECHO CHAMBER", artist: "Marcus Vane", amount: 14000, status: "SETTLED", date: "Oct 12, 14:32" },
  { id: "#TXN-90820", entity: "SONIC VOID LABS", artist: "Elena Rossi", amount: 10000, status: "SETTLED", date: "Oct 12, 12:15" },
  { id: "#TXN-90819", entity: "PRISM AUDIO", artist: "Kaito Tanaka", amount: 21000, status: "PROCESSING", date: "Oct 11, 23:45" },
  { id: "#TXN-90818", entity: "THE CONCRETE LOFT", artist: "Sarah Jenkins", amount: 6600, status: "SETTLED", date: "Oct 11, 21:10" },
  { id: "#TXN-90817", entity: "BASEMENT ZERO", artist: "David Bowie Jr.", amount: 2800, status: "REFUNDED", date: "Oct 11, 19:40" },
  { id: "#TXN-90816", entity: "ABBEY ROAD EAST", artist: "Amira Hassan", amount: 19500, status: "SETTLED", date: "Oct 11, 15:00" },
];

export const MOCK_SLOTS = [
  { date: "OCT 24", day: "MONDAY", time: "09:00 AM — 12:00 PM", status: "Booked", detail: 'BOOKED: "SYNTHWAVE PULSE" SESSION', studioColor: "#014751" },
  { date: "OCT 24", day: "MONDAY", time: "01:00 PM — 04:00 PM", status: "Available", detail: "AVAILABLE FOR BOOKING", studioColor: "#D8FF2A" },
  { date: "OCT 25", day: "TUESDAY", time: "10:00 AM — 06:00 PM", status: "Blocked", detail: "BLOCKED: MAINTENANCE", studioColor: "#888" },
  { date: "OCT 26", day: "WEDNESDAY", time: "06:00 PM — 10:00 PM", status: "Available", detail: "AVAILABLE FOR BOOKING", studioColor: "#D8FF2A" },
  { date: "OCT 27", day: "THURSDAY", time: "12:00 PM — 03:00 PM", status: "Booked", detail: 'BOOKED: "VOCAL TRACKING" SESSION', studioColor: "#014751" },
  { date: "OCT 28", day: "FRIDAY", time: "09:00 AM — 05:00 PM", status: "Available", detail: "AVAILABLE FOR BOOKING", studioColor: "#D8FF2A" },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tizii-backend.onrender.com';
export const api = {
  get: (url: string) => fetch(`${API_BASE_URL}${url}`),
  post: (url: string, data: any) => fetch(`${API_BASE_URL}${url}`, { method: 'POST', body: JSON.stringify(data) }),
};

export const authApi = {
  signup: async (data: any) => ({ data: { user: { id: "mock-user", email: data.email }, session: { access_token: "mock-token" } } }),
  login: async (data: any) => ({ data: { user: { id: "mock-user", email: data.email }, session: { access_token: "mock-token" } } }),
};

export interface StudioPayload {
  name: string; location?: string; description?: string;
  owner_id?: string; amenities?: string[]; timezone?: string; image_url?: string;
}

export const studiosApi = {
  getAll: async () => ({ data: { studios: MOCK_STUDIOS } }),
  getById: async (id: string) => {
    const studio = MOCK_STUDIOS.find(s => s.id === id) || MOCK_STUDIOS[0];
    return { data: { studio } };
  },
  getRooms: async (studioId: string) => {
    const rooms = MOCK_ROOMS[studioId] || MOCK_ROOMS["1"];
    return { data: { rooms } };
  },
  create: async (payload: StudioPayload) => ({ data: { ...payload, id: Math.random().toString() } }),
  update: async (id: string, payload: StudioPayload) => ({ data: { ...payload, id } }),
  delete: async (id: string) => ({ data: { success: true } }),
};

export interface BookingSlot { start_time: string; end_time: string; }
export interface CreateBookingPayload {
  studio_id: string; room_id?: string; slots: BookingSlot[];
  payment_method: "online" | "offline"; phone_number?: string; currency?: string; notes?: string;
}

export const bookingsApi = {
  getAll: async () => ({ data: { bookings: MOCK_BOOKINGS } }),
  getById: async (id: string) => {
    const booking = MOCK_BOOKINGS.find(b => b.id === id) || MOCK_BOOKINGS[0];
    return { data: { booking } };
  },
  create: async (payload: CreateBookingPayload) => ({ data: { id: "new-booking-id", status: "pending", ...payload } }),
  updateStatus: async (id: string, status: string) => ({ data: { id, status } }),
  delete: async (id: string) => ({ data: { success: true } }),
};

export const paymentsApi = {
  initiate: async (data: { booking_id: string; phone_number: string }) => ({ data: { success: true, message: "Mock STK Push Sent" } }),
  checkStatus: async (id: string) => ({ data: { payment_status: "paid" } }),
};

export const usersApi = {
  updateProfile: async (userId: string, payload: any) => ({ data: { ...payload, id: userId } }),
  checkEmailUnique: async (email: string) => ({ data: { unique: true } }),
};
