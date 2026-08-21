import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import Question from "../models/Question.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured.");
    }

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

// Read JSON Files
const readQuestions = (folderPath) => {
  let questions = [];

  console.log("📁 Reading seed folder:", folderPath);

  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Seed folder not found: ${folderPath}`);
    return questions;
  }

  const files = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".json"));

  console.log("📄 JSON files found:", files);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    try {
      console.log(`Reading: ${file}`);
      const raw = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(raw);

      if (Array.isArray(json)) {
        questions.push(...json);
        console.log(`   ✅ ${json.length} questions found`);
      } else {
        questions.push(json);
        console.log("   ✅ 1 question found");
      }
    } catch (err) {
      console.error(`❌ Error reading ${file}`);
      console.log(err.message);
    }
  }

  return questions;
};

const seedQuestions = async () => {
  await connectDB();

  try {
    const seedFolder = __dirname;

    const questions = readQuestions(seedFolder);

    console.log("=================================");
    console.log(`📚 TOTAL QUESTIONS FOUND: ${questions.length}`);
    console.log("=================================");

    if (questions.length === 0) {
      throw new Error(`No question JSON records found in ${seedFolder}`);
    }

    let inserted = 0;
    let skipped = 0;
    let failed = 0;

    for (const question of questions) {
      try {
        if (!question.title || !question.slug) {
          console.warn(`⚠ Skipped invalid question: ${question.title || "No title"}`);
          failed++;
          continue;
        }

        const exists = await Question.findOne({
          $or: [{ slug: question.slug }, { title: question.title }],
        });

        if (exists) {
          console.log(`⏭ Already exists: ${question.title}`);
          skipped++;
          continue;
        }

        await Question.create({
          ...question,
          isActive: question.isActive !== undefined ? question.isActive : true,
        });
        console.log(`✅ Inserted: ${question.title}`);
        inserted++;
      } catch (error) {
        console.error(`❌ Failed: ${question.title || "Unknown question"}`);
        console.error(error.message);
        failed++;
      }
    }

    const totalInDatabase = await Question.countDocuments();

    console.log("");
    console.log("=================================");
    console.log("🎉 QUESTION SEED COMPLETED");
    console.log("---------------------------------");
    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭ Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📦 Total in MongoDB: ${totalInDatabase}`);
    console.log("=================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ SEED ERROR:");
    console.error(error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedQuestions();