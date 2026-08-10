import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from '../models/Question.js';

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_copilot');
    const filter = { role: 'Frontend', difficulty: 'Easy', isActive: true, language: 'JavaScript' };
    const qs = await Question.aggregate([{ $match: filter }, { $sample: { size: 3 } }]);
    console.log('count', qs.length);
    console.log(JSON.stringify(qs.map(q => ({ slug: q.slug, role: q.role, difficulty: q.difficulty, language: q.language, isActive: q.isActive })), null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
