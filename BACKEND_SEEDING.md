# Backend Database Seeding Instructions

This guide will help you seed your backend database with test users and studios to simulate the complete booking process.

## Prerequisites
- Backend server running on `http://localhost:4000` (development) or `https://tizii.vercel.app` (production)
- PostgreSQL database connected
- API endpoints working

## Step 1: Create Test Users

### 1.1 Create Admin User
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Admin User",
    "email": "admin@tizii.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Login Credentials:**
- Email: `admin@tizii.com`
- Password: `admin123`
- Role: `admin`
- Access: Admin Dashboard at `/admin/dashboard`

### 1.2 Create Studio Manager User
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Studio Manager",
    "email": "manager@tizii.com",
    "password": "manager123",
    "role": "studio_manager"
  }'
```

**Login Credentials:**
- Email: `manager@tizii.com`
- Password: `manager123`
- Role: `studio_manager`
- Access: Studio Manager Dashboard at `/studio-manager/dashboard`

### 1.3 Create Artist User
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Artist",
    "email": "artist@tizii.com",
    "password": "artist123",
    "role": "artist"
  }'
```

**Login Credentials:**
- Email: `artist@tizii.com`
- Password: `artist123`
- Role: `artist`
- Access: Artist Dashboard at `/artist/dashboard`

## Step 2: Create Test Studios (as Admin)

First, login as admin to get the JWT token:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tizii.com",
    "password": "admin123"
  }'
```

Copy the `token` from the response, then create studios:

### 2.1 Studio 1 - Premium Recording Studio
```bash
curl -X POST http://localhost:4000/studios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Premium Recording Studio",
    "location": "Nairobi, Westlands",
    "price_per_hour": 2500,
    "description": "Professional recording studio with state-of-the-art equipment",
    "amenities": ["Soundproof Booth", "Professional Microphones", "Mixing Console", "WiFi"],
    "image_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800"
  }'
```

### 2.2 Studio 2 - Budget-Friendly Studio
```bash
curl -X POST http://localhost:4000/studios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Budget-Friendly Studio",
    "location": "Nairobi, CBD",
    "price_per_hour": 1500,
    "description": "Affordable studio perfect for beginners and demos",
    "amenities": ["Basic Equipment", "Soundproofing", "WiFi"],
    "image_url": "https://images.unsplash.com/photo-1519508234439-4f23643125c1?w=800"
  }'
```

### 2.3 Studio 3 - Live Performance Space
```bash
curl -X POST http://localhost:4000/studios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Live Performance Space",
    "location": "Nairobi, Kilimani",
    "price_per_hour": 3500,
    "description": "Large studio space for live performances and group sessions",
    "amenities": ["Large Space", "Stage Setup", "Live Monitoring", "Parking", "WiFi"],
    "image_url": "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800"
  }'
```

## Step 3: Complete Booking Flow Simulation

### 3.1 Login as Artist
1. Go to `/auth`
2. Login with:
   - Email: `artist@tizii.com`
   - Password: `artist123`
3. You'll be redirected to `/artist/dashboard`

### 3.2 Browse and Book a Studio
1. Navigate to `/home`
2. Select any studio
3. Choose a date and time
4. Proceed to checkout
5. Select M-Pesa payment method
6. Enter phone number: `254712345678` (for testing)
7. Complete booking

### 3.3 Manager Confirms Booking
1. Logout and login as manager:
   - Email: `manager@tizii.com`
   - Password: `manager123`
2. Go to `/studio-manager/dashboard`
3. View pending bookings
4. Click "Confirm" on the booking
5. After session, click "Complete"

### 3.4 Admin Monitors Everything
1. Logout and login as admin:
   - Email: `admin@tizii.com`
   - Password: `admin123`
2. Go to `/admin/dashboard`
3. View all studios, bookings, and manage the platform

## Quick Test Credentials Summary

| Role | Email | Password | Dashboard URL |
|------|-------|----------|---------------|
| Admin | admin@tizii.com | admin123 | /admin/dashboard |
| Studio Manager | manager@tizii.com | manager123 | /studio-manager/dashboard |
| Artist | artist@tizii.com | artist123 | /artist/dashboard |

## Testing M-Pesa Integration

For testing M-Pesa payments in sandbox:
- Use test phone number: `254708374149` or `254712345678`
- Use test PIN: `1234` (in M-Pesa sandbox app)
- The STK push will appear on your test device

## Notes

- All passwords should be changed in production
- Make sure your backend is running before executing these commands
- Replace `YOUR_ADMIN_TOKEN_HERE` with the actual JWT token from login
- For production, use `https://tizii.vercel.app` instead of `localhost:4000`
- Ensure M-Pesa credentials are properly configured in your backend `.env`

## Troubleshooting

If you encounter errors:
1. Check if backend server is running
2. Verify database connection
3. Ensure all required environment variables are set
4. Check console logs for detailed error messages
5. Verify JWT token is not expired when creating studios
