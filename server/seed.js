import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import PG from './models/PG.js';
import Review from './models/Review.js';
import Inquiry from './models/Inquiry.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pgfinder');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await PG.deleteMany();
    await Review.deleteMany();
    await Inquiry.deleteMany();
    console.log('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9876543210',
    });

    const owner1 = await User.create({
      name: 'Rahul Sharma',
      email: 'owner1@example.com',
      password: hashedPassword,
      role: 'owner',
      phone: '9876543211',
    });

    const owner2 = await User.create({
      name: 'Priya Patel',
      email: 'owner2@example.com',
      password: hashedPassword,
      role: 'owner',
      phone: '9876543212',
    });

    const user1 = await User.create({
      name: 'Amit Kumar',
      email: 'user1@example.com',
      password: hashedPassword,
      role: 'user',
      phone: '9876543213',
    });

    const user2 = await User.create({
      name: 'Sneha Gupta',
      email: 'user2@example.com',
      password: hashedPassword,
      role: 'user',
      phone: '9876543214',
    });

    console.log('Created users');

    // Create PGs
    const pgs = [
      {
        title: 'Sunrise PG - Premium Stay',
        description: 'Welcome to Sunrise PG, your home away from home! We offer comfortable accommodation with all modern amenities. Located in the heart of Koramangala, close to major IT parks and shopping centers.\n\nOur PG features spacious rooms with attached bathrooms, 24/7 power backup, high-speed WiFi, and delicious home-cooked meals. We maintain strict hygiene standards and provide regular housekeeping services.',
        sharingTypes: [
          { type: 1, price: 12000, available: true },
          { type: 2, price: 8000, available: true },
          { type: 3, price: 6000, available: false },
        ],
        genderAllowed: 'male',
        location: {
          address: '123, 4th Cross, Koramangala 4th Block',
          city: 'Bangalore',
          coordinates: { lat: 12.9352, lng: 77.6245 },
        },
        amenities: ['wifi', 'ac', 'tv', 'fridge', 'washing-machine', 'geyser', 'parking', 'power-backup', 'meals'],
        photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
        ownerId: owner1._id,
        avgRating: 4.5,
        reviewCount: 2,
        isActive: true,
      },
      {
        title: 'Girls Comfort PG',
        description: 'Safe and comfortable accommodation exclusively for working women and students. Our PG is located in a secure residential area with CCTV surveillance and security guard.\n\nWe provide fully furnished rooms, nutritious meals, and a friendly environment. The PG is well-connected to public transport and close to major commercial areas.',
        sharingTypes: [
          { type: 2, price: 9000, available: true },
          { type: 3, price: 7000, available: true },
        ],
        genderAllowed: 'female',
        location: {
          address: '456, HSR Layout Sector 2',
          city: 'Bangalore',
          coordinates: { lat: 12.9081, lng: 77.6476 },
        },
        amenities: ['wifi', 'ac', 'tv', 'fridge', 'geyser', 'security', 'meals', 'housekeeping'],
        photos: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        ownerId: owner2._id,
        avgRating: 4.8,
        reviewCount: 1,
        isActive: true,
      },
      {
        title: 'Metro PG - Unisex',
        description: 'Modern co-living space for students and professionals. Metro PG offers affordable accommodation without compromising on quality and comfort.\n\nLocated near major educational institutions and IT hubs. Our facilities include gym, recreation room, and study areas.',
        sharingTypes: [
          { type: 1, price: 15000, available: true },
          { type: 2, price: 10000, available: true },
          { type: 3, price: 7500, available: true },
          { type: 4, price: 5500, available: true },
        ],
        genderAllowed: 'unisex',
        location: {
          address: '789, Indiranagar 100 Feet Road',
          city: 'Bangalore',
          coordinates: { lat: 12.9784, lng: 77.6408 },
        },
        amenities: ['wifi', 'ac', 'tv', 'fridge', 'washing-machine', 'geyser', 'parking', 'power-backup', 'security', 'gym', 'lift'],
        photos: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'],
        ownerId: owner1._id,
        avgRating: 4.2,
        reviewCount: 1,
        isActive: true,
      },
      {
        title: 'Green View PG',
        description: 'Experience peaceful living at Green View PG. Surrounded by greenery, our PG offers a serene environment for students and working professionals.\n\nFeatures include garden area, rooftop terrace, and eco-friendly amenities.',
        sharingTypes: [
          { type: 2, price: 8500, available: true },
          { type: 3, price: 6500, available: true },
        ],
        genderAllowed: 'male',
        location: {
          address: '321, Whitefield Main Road',
          city: 'Bangalore',
          coordinates: { lat: 12.9698, lng: 77.7499 },
        },
        amenities: ['wifi', 'tv', 'fridge', 'geyser', 'parking', 'power-backup', 'meals', 'housekeeping'],
        photos: ['https://images.unsplash.com/photo-1598928519191-3a89e0e7c7dd?w=800'],
        ownerId: owner2._id,
        avgRating: 0,
        reviewCount: 0,
        isActive: true,
      },
      {
        title: 'Royal Stay PG for Women',
        description: 'Premium ladies PG with luxurious amenities. Royal Stay provides a safe and comfortable environment for women with top-notch facilities.\n\nLocated in a prime area with easy access to shopping malls, hospitals, and public transport.',
        sharingTypes: [
          { type: 1, price: 18000, available: true },
          { type: 2, price: 12000, available: false },
        ],
        genderAllowed: 'female',
        location: {
          address: '555, Jayanagar 4th Block',
          city: 'Bangalore',
          coordinates: { lat: 12.9250, lng: 77.5938 },
        },
        amenities: ['wifi', 'ac', 'tv', 'fridge', 'washing-machine', 'geyser', 'parking', 'power-backup', 'security', 'meals', 'housekeeping', 'lift'],
        photos: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=800'],
        ownerId: owner1._id,
        avgRating: 4.0,
        reviewCount: 1,
        isActive: true,
      },
    ];

    const createdPGs = await PG.insertMany(pgs);
    console.log('Created PGs');

    // Create reviews
    const reviews = [
      {
        pgId: createdPGs[0]._id,
        userId: user1._id,
        rating: 5,
        comment: 'Excellent PG! Great food and very clean. The owner is very helpful and supportive.',
      },
      {
        pgId: createdPGs[0]._id,
        userId: user2._id,
        rating: 4,
        comment: 'Good location and amenities. WiFi is fast and reliable. Would recommend.',
      },
      {
        pgId: createdPGs[1]._id,
        userId: user2._id,
        rating: 5,
        comment: 'Very safe and comfortable. The meals are delicious and the staff is friendly.',
      },
      {
        pgId: createdPGs[2]._id,
        userId: user1._id,
        rating: 4,
        comment: 'Nice facilities and good community. Gym could be better equipped though.',
      },
      {
        pgId: createdPGs[4]._id,
        userId: user2._id,
        rating: 4,
        comment: 'Premium facilities but a bit expensive. Worth it for the security and comfort.',
      },
    ];

    await Review.insertMany(reviews);
    console.log('Created reviews');

    // Create inquiries
    const inquiries = [
      {
        pgId: createdPGs[0]._id,
        userId: user1._id,
        name: 'Amit Kumar',
        phone: '9876543213',
        message: 'Hi, I am interested in the 2 sharing room. Is it still available?',
        status: 'pending',
      },
      {
        pgId: createdPGs[1]._id,
        userId: user2._id,
        name: 'Sneha Gupta',
        phone: '9876543214',
        message: 'Hello, I would like to schedule a visit this weekend.',
        status: 'contacted',
      },
    ];

    await Inquiry.insertMany(inquiries);
    console.log('Created inquiries');

    // Add PG to wishlist
    user1.wishlist = [createdPGs[1]._id, createdPGs[3]._id];
    await user1.save();

    user2.wishlist = [createdPGs[0]._id];
    await user2.save();
    console.log('Added items to wishlists');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('  Admin: admin@example.com / password');
    console.log('  Owner: owner1@example.com / password');
    console.log('  Owner: owner2@example.com / password');
    console.log('  User:  user1@example.com / password');
    console.log('  User:  user2@example.com / password');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
