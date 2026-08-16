import dotenv from "dotenv";
import mongoose from "mongoose";
import Question from "../models/Question.js";

dotenv.config();

(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured.");
    }

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected.");

    const filter = {
      role: "Frontend",
      difficulty: "Easy",
      isActive: true,
      language: "JavaScript",
    };

    const qs = await Question.aggregate([
      { $match: filter },
      { $sample: { size: 3 } },
    ]);

    console.log("count", qs.length);

    console.log(
      JSON.stringify(
        qs.map((q) => ({
          slug: q.slug,
          role: q.role,
          difficulty: q.difficulty,
          language: q.language,
          isActive: q.isActive,
        })),
        null,
        2
      )
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (e) {
    console.error("MongoDB script error:", e);
    process.exit(1);
  }
})();