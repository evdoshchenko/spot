import path from 'path';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user';

import bodyParser from 'body-parser';
import router from './routes/films';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/authdb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/signup', (req: Request, res: Response) => {
  const { email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      email: email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: email,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.use('/films', router);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});
