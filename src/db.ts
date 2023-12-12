import mongoose from 'mongoose';

export async function connectToDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    console.log(' ➜ 🎸 Connected to the MongoDB! Yeap!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
