# PG Finder

A full-stack web application for finding and listing Paying Guest (PG) accommodations. Built with React + Vite frontend and Node.js/Express backend with MongoDB.

## Features

### For Tenants
- 🔍 Search PGs by location, price, sharing type, gender, and rating
- ♥ Save favorite PGs to wishlist
- 📞 Contact PG owners directly
- ⭐ Read and write reviews
- 🗺️ View PG locations on Google Maps

### for PG Owners
- 📝 Create and manage PG listings
- 📸 Upload multiple photos
- 💰 Set prices for different sharing types (1, 2, 3, 4 sharing)
- 📋 Manage inquiries from interested tenants
- 📊 View ratings and reviews

### For Admins
- 👥 Manage all users and their roles
- 🏠 Manage all PG listings
- 🗑️ Delete inappropriate reviews

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- React Query for API state management
- React Hook Form + Zod for form validation
- Axios for API calls

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Multer for file uploads
- Cloudinary for image storage
- Express Validator for input validation

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database & Cloudinary config
│   │   ├── middleware/     # Auth, error handling, role checks
│   │   ├── models/         # Mongoose models (User, PG, Review, Inquiry)
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── state/          # Auth context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Google Maps API key (optional, for maps)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pg-finder
JWT_SECRET=your-super-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### PG Listings
- `GET /api/pgs` - Search PGs with filters
- `GET /api/pgs/:id` - Get single PG details
- `POST /api/pgs` - Create PG (owner/admin)
- `PUT /api/pgs/:id` - Update PG (owner/admin)
- `DELETE /api/pgs/:id` - Delete PG (owner/admin)
- `GET /api/pgs/my-listings` - Get owner's listings

### Reviews
- `GET /api/pgs/:id/reviews` - Get PG reviews
- `POST /api/pgs/:id/reviews` - Add review (auth)
- `PUT /api/reviews/:id` - Update review (owner)
- `DELETE /api/reviews/:id` - Delete review (owner/admin)

### Wishlist
- `POST /api/wishlist/:pgId` - Toggle wishlist
- `GET /api/wishlist` - Get user's wishlist

### Inquiries
- `POST /api/pgs/:id/inquiry` - Submit inquiry
- `GET /api/inquiries` - Get inquiries (owner/admin)

### Admin
- `GET /api/admin/pgs` - Get all PGs
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

## User Roles

1. **User (Tenant)** - Can search, view PGs, save to wishlist, write reviews
2. **Owner** - Can create and manage PG listings, view inquiries
3. **Admin** - Full access to manage all users, PGs, and reviews

## Screenshots

### Home Page
- Hero section with search CTA
- Popular cities
- Latest PG listings

### Search Page
- Advanced filters (price, sharing, gender, rating)
- Grid view of PG cards
- Responsive layout

### PG Detail Page
- Photo gallery
- Amenities with icons
- Room types and pricing
- Location map
- Contact form
- Reviews section

### Owner Dashboard
- Statistics overview
- Manage listings
- View inquiries

### Admin Panel
- User management
- PG management
- Role assignment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
