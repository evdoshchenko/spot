import type { NextFunction, Request, Response } from 'express'
import User from '../models/user';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

import { AppError } from './errors';

import { celebrate, Joi, Segments } from 'celebrate';


export const get = async (req: Request, res: Response) => {
  return User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log('_id=',req.user._id);
  return User.findOne({_id: req.params.userId})
    .then((user) => {
      if (!user) {
        throw new AppError(404, `Запрашиваемый пользователь не найден`)
      }

      res.send(user);
    })
    .catch(next);
}



export const post = async (req: Request, res: Response, next: NextFunction) => {
    const { name, about, avatar } = req.body;

    return User.create({ name, about, avatar })
      .then((user) => {
        if (!user) {
          throw new AppError(404, `Пользователь с указанным _id не найден`)
        }
        res.send({ data: user })
      })
      .catch(next);
}

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  console.log('_id=',req.user._id);
  return User.findByIdAndUpdate({_id: new ObjectId(req.user._id)}, { name, about, avatar})
    .then((user) => {
      if (!user) {
        throw new AppError(404, `Пользователь с указанным _id не найден`)
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
        throw new AppError(404, `Пользователь с указанным _id не найден`)
      }
      res.send({ data: user })
    })
    .catch(next);
}


export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
      avatar: Joi.string().required(),
    }),
  })(req,res,next)
}

export const validateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  })(req,res,next)
}
