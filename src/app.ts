import path from 'path';
import express from 'express';
import { authToken } from './controllers/authToken';

import { router } from './Router';
import { connectToDB } from './db'
import { errorResponder } from './controllers/errors'

import { PORT } from './config';
import { errors } from 'celebrate';


async function createServer() {
  connectToDB();

  const app = express();
  app.use(authToken)
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(router);

  app.use(errors());
  app.use(errorResponder)

  return { app }
}

createServer().then(({ app }) => app.listen(PORT, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${PORT}`)
}))
