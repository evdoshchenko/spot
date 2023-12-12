import type { Request, Response, NextFunction } from 'express'
import Card from '../models/card';

import { AppError } from './errors';

import { celebrate, Joi, Segments } from 'celebrate';

export const get = async (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}

export const getCard = async (req: Request, res: Response) => {
  return Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      console.log(card);
      res.send({ data: card })
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  return Card.deleteOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new AppError(404, `Передан несуществующий _id карточки`)
      }
      res.send({ data: card })
    })
    .catch(next);
}

export const post = async (req: Request, res: Response) => {
  const { name, link, ownerId, likes = [], createdAt = Date.now() } = req.body;

  return Card.create({ name, link, owner: ownerId, likes, createdAt })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}


export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new AppError(404, `Передан несуществующий _id карточки`)
      }
      res.send({ data: card })
    })
    .catch(next);
}

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new AppError(404, `Передан несуществующий _id карточки`)
      }
      res.send({ data: card })
    })
    .catch(next);
}

export const validateCard = async (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
      ownerId: Joi.string().alphanum().length(24),
    }),
  })(req,res,next)
}

export const validateLike = async (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  })(req,res,next)
}
