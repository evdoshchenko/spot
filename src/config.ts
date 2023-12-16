import dotenv from 'dotenv'
dotenv.config()

export const { PORT } = process.env || 3000;
export const { DB_PATH } = process.env || 'mongodb://localhost:27017/mestodb';
export const { JWT_WORD } = process.env || 'super-strong-secret';

