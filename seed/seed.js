require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Event = require("../models/Event");

const seedDatabase = async () => {
  try {
    await connectDB();

    // Remove old data
    await Event.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Old data removed");

    // Create Admin
    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@eventpulse.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created");

    // Create Categories
    const categories = await Category.insertMany([
      {
        name: "Technology",
        description: "Technology Events",
      },
      {
        name: "Education",
        description: "Educational Events",
      },
      {
        name: "Sports",
        description: "Sports Events",
      },
    ]);

    console.log("Categories created");

    // Create Events
    await Event.insertMany([
      {
        title: "Node.js Workshop",
        description: "Learn Backend Development",
        date: new Date("2026-09-01"),
        city: "Cairo",
        capacity: 100,
        category: categories[0]._id,
      },
      {
        title: "AI Conference",
        description: "Artificial Intelligence",
        date: new Date("2026-10-15"),
        city: "Alexandria",
        capacity: 300,
        category: categories[0]._id,
      },
      {
        title: "Football Tournament",
        description: "Local Sports Event",
        date: new Date("2026-11-20"),
        city: "Zagazig",
        capacity: 200,
        category: categories[2]._id,
      },
    ]);

    console.log("Events created");

    console.log("Database seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();