# PG Finder

A full-stack web application for finding Paying Guest (PG) accommodations. Built with React, Node.js, Express, and MongoDB.

## Features

- **Search & Filter**: Find PGs by location, sharing type, price, gender preference, amenities, and rating
- **User Authentication**: JWT-based authentication with support for regular users, PG owners, and admins
- **PG Management**: Owners can add, edit, and manage their PG listings with photo uploads
- **Wishlist**: Save favorite PGs for later comparison
- **Reviews & Ratings**: Users can leave reviews and ratings for PGs
- **Inquiry System**: Contact PG owners directly through the platform
- **Google Maps Integration**: View PG locations on an interactive map
- **Admin Dashboard**: Comprehensive admin panel for managing users and listings
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- React Query for API state management
- React Hook Form + Zod for form handling and validation
- React Google Maps API for map integration
- Axios for HTTP requests

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer + Cloudinary for image uploads
- Express Validator for input validation
- CORS enabled

## Project Structure

```
pg-finder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React Query hooks
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API service
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── middleware/       # Custom middleware
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pg-finder
```

2. Install dependencies:
```bash
npm run install-deps
```

3. Set up environment variables:

   **Server (.env):**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pgfinder
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   **Client (.env):**
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the development server:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) concurrently.

### Creating Demo Accounts

To create an admin account, register a user and then update their role in the database:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### PG Listings
- `GET /api/pgs` - Get all PGs with filters
- `GET /api/pgs/:id` - Get single PG
- `POST /api/pgs` - Create new PG (owner/admin)
- `PUT /api/pgs/:id` - Update PG (owner/admin)
- `DELETE /api/pgs/:id` - Delete PG (owner/admin)
- `GET /api/pgs/my-listings` - Get owner's PGs

### Reviews
- `GET /api/reviews/pg/:pgId` - Get PG reviews
- `POST /api/reviews/pg/:pgId` - Add review (auth)
- `PUT /api/reviews/:id` - Update review (owner/admin)
- `DELETE /api/reviews/:id` - Delete review (owner/admin)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/:pgId` - Add to wishlist
- `DELETE /api/wishlist/:pgId` - Remove from wishlist

### Inquiries
- `POST /api/inquiries/pg/:pgId` - Create inquiry (auth)
- `GET /api/inquiries` - Get owner's inquiries
- `PUT /api/inquiries/:id` - Update inquiry status

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/pgs` - Get all PGs
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/reviews/:id` - Delete any review

## Pages

### Public
- `/` - Home page with featured PGs and search
- `/search` - Search results with filters and map
- `/pg/:id` - PG details page
- `/login` - Login page
- `/register` - Registration page

### User (Authenticated)
- `/wishlist` - Saved PGs
- `/profile` - User profile

### Owner
- `/owner/dashboard` - Owner dashboard
- `/owner/create-pg` - Add new PG
- `/owner/edit-pg/:id` - Edit PG
- `/owner/inquiries` - Manage inquiries

### Admin
- `/admin/dashboard` - Admin dashboard with stats
- `/admin/pgs` - Manage all PGs
- `/admin/users` - Manage users

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run install-deps` - Install all dependencies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
