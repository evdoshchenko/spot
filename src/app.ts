import path from 'path';
import express from 'express';
import { router } from './Router';
import { connectToDB } from './db'
import { errorResponder } from './controllers/errors'
import { PORT } from './config';
import { errors } from 'celebrate';
import cookieParser from "cookie-parser";
import { requestLogger, errorLogger } from './middlewares/logger';


async function createServer() {
  connectToDB();

  const app = express();

  app.use(cookieParser());
  app.get('/token', (req, res) => {
    console.log(req.cookies.jwt);
  });

  app.use(express.static(path.join(__dirname, 'public')));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(requestLogger);
  app.use(router);
  app.use(errorLogger);

  app.use(errors());
  app.use(errorResponder)

  return { app }
}

createServer().then(({ app }) => app.listen(PORT, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${PORT}`)
}))
