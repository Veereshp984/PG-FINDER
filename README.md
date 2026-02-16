# PG Finder

A full-stack web application for finding and listing Paying Guest (PG) accommodations. Built with React, Node.js, Express, and MongoDB.

## Features

### For Tenants
- 🔍 Search PGs by sharing type (1/2/3/4), price, gender, location, and rating
- 📍 Map integration to view PG locations
- ❤️ Save favorites to wishlist
- ⭐ Read and write reviews
- 💬 Contact PG owners directly

### For PG Owners
- 🏠 Create and manage PG listings
- 📸 Upload multiple photos via Cloudinary
- 📊 Dashboard with inquiries and reviews
- 💰 Set different prices for different sharing types

### For Admins
- 👥 Manage users and their roles
- 🏢 View and delete any PG listing
- 📝 Moderate reviews

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- React Query for server state management
- React Hook Form + Zod for form handling
- Axios for API calls

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Multer for file uploads
- Cloudinary for image storage
- Express Validator for validation

## Project Structure

```
pg-finder/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & Cloudinary config
│   │   ├── middleware/   # Auth, roles, error handling
│   │   ├── models/       # Mongoose models (User, PG, Review, Inquiry)
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Upload utilities
│   │   └── index.js      # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── state/        # Auth context
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Backend (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pg-finder
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Run the Application

```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### PG Listings
- `GET /api/pgs` - List all PGs (with filters)
- `GET /api/pgs/:id` - Get single PG
- `GET /api/pgs/my-listings` - Get owner's listings
- `POST /api/pgs` - Create new PG (owner/admin)
- `PUT /api/pgs/:id` - Update PG (owner/admin)
- `DELETE /api/pgs/:id` - Delete PG (owner/admin)

### Reviews
- `GET /api/pgs/:id/reviews` - Get PG reviews
- `POST /api/pgs/:id/reviews` - Add review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/:pgId` - Toggle wishlist

### Inquiries
- `GET /api/inquiries` - Get owner's inquiries
- `POST /api/pgs/:id/inquiry` - Send inquiry

### Admin
- `GET /api/admin/pgs` - Get all PGs
- `DELETE /api/admin/pgs/:id` - Delete any PG
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/reviews/:id` - Delete any review

## User Roles

- **user** - Can search, view, save to wishlist, write reviews, contact owners
- **owner** - Can create/manage PG listings, view inquiries
- **admin** - Full access to manage users, PGs, and reviews

## Default User Flow

1. **Browse**: Visit `/search` to browse all PG listings
2. **Filter**: Use filters for sharing type, price, gender, location, rating
3. **View Details**: Click on a PG to see photos, amenities, map, and reviews
4. **Contact**: Login and fill inquiry form to contact PG owner
5. **Save**: Add PGs to wishlist for later viewing

## Owner Flow

1. **Register**: Create account as "PG Owner"
2. **Dashboard**: Visit `/owner/dashboard` to manage listings
3. **Create**: Add new PG with photos, amenities, sharing options
4. **Manage**: Edit listings and view tenant inquiries

## Mobile Responsive

The application is fully responsive with a mobile-first design:
- Mobile navigation menu
- Responsive grids for PG listings
- Touch-friendly UI elements
- Optimized forms for mobile input

## Development Notes

### Adding New Amenities
Edit the `amenityIcons` object in `frontend/src/pages/PGDetail.jsx` to add icons for new amenities.

### Image Upload Limits
- Maximum 10 images per PG
- Images are uploaded to Cloudinary
- Supported formats: JPG, PNG, WebP

### Map Integration
Google Maps Embed API is used for displaying PG locations. Requires a valid API key with Maps Embed API enabled.

## License

MIT License
