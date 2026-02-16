import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PG from "../models/PG.js";
import Review from "../models/Review.js";
import { connectDB } from "../config/db.js";

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await PG.deleteMany({});
    await Review.deleteMany({});

    console.log("Cleared existing data");

    // Create demo users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@pgfinder.com",
      password: hashedPassword,
      role: "admin",
      phone: "9876543210"
    });

    const owner1 = await User.create({
      name: "Rajesh Kumar",
      email: "owner1@pgfinder.com",
      password: hashedPassword,
      role: "owner",
      phone: "9876543211"
    });

    const owner2 = await User.create({
      name: "Priya Sharma",
      email: "owner2@pgfinder.com",
      password: hashedPassword,
      role: "owner",
      phone: "9876543212"
    });

    const user = await User.create({
      name: "Amit Singh",
      email: "user@pgfinder.com",
      password: hashedPassword,
      role: "user",
      phone: "9876543213"
    });

    console.log("Created demo users");

    // Create demo PGs
    const samplePhotos = [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ];

    const pgs = await PG.create([
      {
        title: "Sunshine PG for Girls",
        description: "A premium PG accommodation exclusively for girls with modern amenities, 24/7 security, and homely food. Located near major colleges and IT parks with easy access to public transport.",
        sharingTypes: [
          { type: 1, price: 12000, available: true },
          { type: 2, price: 8000, available: true },
          { type: 3, price: 6000, available: false }
        ],
        genderAllowed: "female",
        location: {
          address: "123, Koramangala 5th Block",
          city: "Bangalore",
          coordinates: { lat: 12.9352, lng: 77.6245 }
        },
        amenities: ["WiFi", "AC", "TV", "Washing Machine", "Security", "Food", "Hot Water"],
        photos: samplePhotos,
        ownerId: owner2._id,
        isActive: true
      },
      {
        title: "Royal Stay PG",
        description: "Luxury PG for working professionals and students. Fully furnished rooms with attached bathrooms, high-speed internet, and gym access.",
        sharingTypes: [
          { type: 1, price: 15000, available: true },
          { type: 2, price: 9000, available: true },
          { type: 4, price: 5000, available: true }
        ],
        genderAllowed: "male",
        location: {
          address: "45, HSR Layout Sector 2",
          city: "Bangalore",
          coordinates: { lat: 12.9141, lng: 77.6481 }
        },
        amenities: ["WiFi", "AC", "TV", "Washing Machine", "Gym", "Security", "Power Backup"],
        photos: samplePhotos,
        ownerId: owner1._id,
        isActive: true
      },
      {
        title: "Green Valley PG",
        description: "Affordable PG with all basic amenities. Perfect for students looking for budget-friendly accommodation with good connectivity.",
        sharingTypes: [
          { type: 2, price: 5500, available: true },
          { type: 3, price: 4000, available: true }
        ],
        genderAllowed: "unisex",
        location: {
          address: "78, Whitefield Main Road",
          city: "Bangalore",
          coordinates: { lat: 12.9698, lng: 77.7499 }
        },
        amenities: ["WiFi", "Security", "Housekeeping", "Hot Water", "Power Backup"],
        photos: samplePhotos,
        ownerId: owner1._id,
        isActive: true
      },
      {
        title: "Comfort Zone PG",
        description: "Premium unisex PG with modern facilities. Features include AC rooms, high-speed WiFi, washing machine, and delicious home-cooked meals.",
        sharingTypes: [
          { type: 1, price: 18000, available: true },
          { type: 2, price: 10000, available: true }
        ],
        genderAllowed: "unisex",
        location: {
          address: "234, Indiranagar 100ft Road",
          city: "Bangalore",
          coordinates: { lat: 12.9784, lng: 77.6408 }
        },
        amenities: ["WiFi", "AC", "TV", "Washing Machine", "Refrigerator", "Security", "Food", "Parking"],
        photos: samplePhotos,
        ownerId: owner2._id,
        isActive: true
      },
      {
        title: "Student Hub PG",
        description: "Specially designed for students with study areas, library, and peaceful environment. Close to major educational institutions.",
        sharingTypes: [
          { type: 2, price: 6500, available: false },
          { type: 3, price: 4500, available: true },
          { type: 4, price: 3500, available: true }
        ],
        genderAllowed: "male",
        location: {
          address: "56, JP Nagar Phase 3",
          city: "Bangalore",
          coordinates: { lat: 12.9063, lng: 77.5859 }
        },
        amenities: ["WiFi", "Security", "Housekeeping", "Hot Water", "Power Backup", "Parking"],
        photos: samplePhotos,
        ownerId: owner1._id,
        isActive: true
      },
      {
        title: "Elite Women's PG",
        description: "Safe and secure PG exclusively for working women. Features 24/7 security, CCTV surveillance, and proximity to major IT companies.",
        sharingTypes: [
          { type: 1, price: 14000, available: true },
          { type: 2, price: 8500, available: true }
        ],
        genderAllowed: "female",
        location: {
          address: "89, Electronic City Phase 1",
          city: "Bangalore",
          coordinates: { lat: 12.8458, lng: 77.6615 }
        },
        amenities: ["WiFi", "AC", "TV", "Washing Machine", "Security", "Food", "Gym", "Hot Water"],
        photos: samplePhotos,
        ownerId: owner2._id,
        isActive: true
      }
    ]);

    console.log("Created demo PGs");

    // Create demo reviews
    await Review.create([
      { pgId: pgs[0]._id, userId: user._id, rating: 5, comment: "Excellent PG with great food and friendly staff!" },
      { pgId: pgs[0]._id, userId: admin._id, rating: 4, comment: "Good facilities, slightly expensive but worth it." },
      { pgId: pgs[1]._id, userId: user._id, rating: 5, comment: "Best PG in HSR Layout, highly recommended!" },
      { pgId: pgs[2]._id, userId: admin._id, rating: 3, comment: "Decent budget option, basic amenities available." },
      { pgId: pgs[3]._id, userId: user._id, rating: 5, comment: "Luxury living at affordable prices!" }
    ]);

    console.log("Created demo reviews");

    // Update PG ratings
    for (const pg of pgs) {
      const reviews = await Review.find({ pgId: pg._id });
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        pg.avgRating = avgRating;
        pg.reviewCount = reviews.length;
        await pg.save();
      }
    }

    console.log("Updated PG ratings");

    console.log("\n✅ Seed data created successfully!");
    console.log("\nDemo Accounts:");
    console.log("  Admin: admin@pgfinder.com / password123");
    console.log("  Owner: owner1@pgfinder.com / password123");
    console.log("  User:  user@pgfinder.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
