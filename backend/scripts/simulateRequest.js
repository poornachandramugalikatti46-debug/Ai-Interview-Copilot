import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';
import { startInterview } from '../controllers/interviewController.js';

dotenv.config();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNmRlYzJhMTNkZWY3ZTRkZGMzNThkMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzg1NTg4Nzg3LCJleHAiOjE3ODYxOTM1ODd9.WX1M2Vw__G8mEPIDVDrPQIFPICDJbA0Nlhc2AnRVIug';

(async ()=>{
  await mongoose.connect(process.env.MONGO_URI);

  const req = {
    headers: { authorization: 'Bearer ' + token },
    body: { role: 'Frontend', difficulty: 'Easy', language: 'JavaScript', duration: 30, count: 3, company: 'Random', topic: 'Mixed' },
  };

  const res = {
    _status: 200,
    status(code) { this._status = code; return this; },
    json(obj){ console.log('JSON RESPONSE:', this._status, JSON.stringify(obj)); return obj; }
  };

  const next = async ()=>{
    await startInterview(req,res);
  };

  await protect(req,res,next);
  process.exit(0);
})();
