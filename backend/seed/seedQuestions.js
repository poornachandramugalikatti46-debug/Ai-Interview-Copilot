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

  if (!fs.existsSync(folderPath)) {
    console.log(`⚠ Folder not found: ${folderPath}`);
    return questions;
  }

  const files = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(raw);

      if (Array.isArray(json)) {
        questions.push(...json);
      } else {
        questions.push(json);
      }
    } catch (err) {
      console.log(`❌ Error reading ${file}`);
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

    console.log(`📚 Found ${questions.length} questions`);

    let inserted = 0;
    let skipped = 0;

    for (const question of questions) {
      if (!question.slug) {
        console.warn(`Skipping entry without slug: ${question.title || JSON.stringify(question).slice(0, 80)}`);
        continue;
      }

      const exists = await Question.findOne({ slug: question.slug });

      if (exists) {
        skipped++;
        continue;
      }

      await Question.create(question);
      inserted++;
    }

    console.log("--------------------------------");
    console.log(`✅ Inserted : ${inserted}`);
    console.log(`⏭ Skipped  : ${skipped}`);
    console.log(`📦 Total    : ${questions.length}`);
    console.log("--------------------------------");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedQuestions();