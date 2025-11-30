const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const fabricData = require('./fabricData');

connectDB();

async function seed() {
  try {
    console.log("Clearing old fabric data...");
    await Product.deleteMany();

    console.log("Inserting new fabrics...");
    await Product.insertMany(fabricData);

    console.log("Fabric seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
