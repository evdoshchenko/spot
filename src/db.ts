import mongoose from 'mongoose';
import { DB_PATH } from './config';

export async function connectToDB() {
  try {
    await mongoose.connect(String(DB_PATH));
    console.log(' ➜ 🎸 Connected to the MongoDB! Yeap!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
