import type { NextFunction, Request, Response } from 'express'
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { celebrate, Joi, Segments } from 'celebrate';
import { ObjectId } from 'mongodb';

import { JWT_WORD } from '../config';
import {
  NotFoundError,
  ConflictError,
} from '../controllers/errors';


export const get = async (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  return User.findOne({ _id: req.params.userId })
    .then((user) => res.send({ data: user }))
    .catch(next);
}

export const getUserMe = async (req: Request, res: Response, next: NextFunction) => {
  return User.findOne({ _id: req.user._id })
  .then((user) => res.send({ data: user }))
  .catch(next);
}

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        String(JWT_WORD),
        { expiresIn: '7d'
      })

      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true
        })
        .end();
    })
    .catch(next);
}

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash: string) =>
      User.create({ name, about, avatar, email, password: hash })
    .then((user) => {
      if (!user) {
        throw new NotFoundError( `Пользователь с указанным _id не найден`)
      }
      res.status(201).send({
        _id: user._id,
        email: email,
      })
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError( `Такой пользователь уже существует`)
      }
      next(err)
    }));
}

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.findByIdAndUpdate({_id: new ObjectId(req.user._id)}, { name, about, avatar})
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным _id не найден`)
      }
      res.send({ data: user })
    })
    .catch(next);
}

export const patchAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate({_id: new ObjectId(req.user._id)}, { avatar })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным _id не найден`)
      }
      res.send({ data: user })
    })
    .catch(next);
}

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    }),
  })(req,res,next)
}

export const validateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().pattern((new RegExp(`https?:\/\/(www\.)?([\w\-]{1,}\.)([\w\.~:\/\?#\[\]@!\$&'\(\)\*\+,;=\-]{2,})#?`))).required(),
    }),
  })(req,res,next)
}
