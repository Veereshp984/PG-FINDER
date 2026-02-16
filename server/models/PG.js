import mongoose from 'mongoose';

const sharingTypeSchema = new mongoose.Schema({
  type: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const pgSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  sharingTypes: [sharingTypeSchema],
  genderAllowed: {
    type: String,
    required: [true, 'Gender preference is required'],
    enum: ['male', 'female', 'unisex']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    }
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'tv', 'fridge', 'washing-machine', 'geyser', 'parking', 
           'power-backup', 'security', 'meals', 'gym', 'lift', 'housekeeping']
  }],
  photos: [{
    type: String,
    required: true
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
pgSchema.index({ 'location.coordinates': '2dsphere' });

// Index for search
pgSchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

const PG = mongoose.model('PG', pgSchema);
export default PG;
