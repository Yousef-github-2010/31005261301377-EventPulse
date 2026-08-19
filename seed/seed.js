require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Message = require("../models/Message");

const seedDatabase = async () => {
  try {
    await connectDB();

    await Message.deleteMany();
    await Registration.deleteMany();
    await Event.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Old data removed");

    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@eventpulse.com",
      password: hashedPassword,
      role: "admin",
    });

    const attendeePassword = await bcrypt.hash("Attendee123", 10);

    const attendee = await User.create({
      name: "Test Attendee",
      email: "attendee@eventpulse.com",
      password: attendeePassword,
      role: "attendee",
    });

    console.log("Users created");

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

    const events = await Event.insertMany([
      {
        title: "Node.js Workshop",
        description: "Learn Backend Development",
        category: categories[0]._id,
        date: new Date("2026-09-01"),
        city: "Cairo",
        venue: "Cairo University",
        capacity: 100,
        organizer: admin._id,
      },
      {
        title: "AI Conference",
        description: "Artificial Intelligence Conference",
        category: categories[0]._id,
        date: new Date("2026-10-15"),
        city: "Alexandria",
        venue: "Bibliotheca Alexandrina",
        capacity: 300,
        organizer: admin._id,
      },
      {
        title: "Football Tournament",
        description: "Local Sports Event",
        category: categories[2]._id,
        date: new Date("2026-11-20"),
        city: "Zagazig",
        venue: "Zagazig Sports Club",
        capacity: 200,
        organizer: admin._id,
      },
      {
        title: "Web Development Workshop",
        description: "Modern Web Development",
        category: categories[1]._id,
        date: new Date("2026-12-10"),
        city: "Cairo",
        venue: "Egyptian Knowledge Bank",
        capacity: 80,
        organizer: admin._id,
      },
    ]);

    console.log("Events created");

    await Registration.create({
      event: events[0]._id,
      attendee: attendee._id,
    });

    await Message.create({
      event: events[0]._id,
      sender: admin._id,
      text: "Welcome to the Node.js Workshop!",
    });

    console.log("Registration and message created");
    console.log("Database seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();