import type { Request, Response, NextFunction } from 'express'
import Card from '../models/card';

import { celebrate, Joi, Segments } from 'celebrate';

import {
  NotFoundError
} from '../controllers/errors';

export const get = async (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

export const getCard = async (req: Request, res: Response, next: NextFunction) => {
  return Card.findOne({ _id: req.params.cardId })
    .then((card) => res.send({ data: card }))
    .catch(next);
}

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий _id карточки`);
      }
      if (String(card.owner) === req.user._id) {
        Card.deleteOne({ _id: cardId })
          .then(() => res.send({ message: 'Карточка была удалена' }))
          .catch(next);

      } else {
        throw new NotFoundError(`Чужая карточка`);
      }
    })
    .catch(next);
}

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link, ownerId, likes = [], createdAt = Date.now() } = req.body;

  return Card.create({ name, link, owner: ownerId, likes, createdAt })
    .then((card) => res.send({ data: card }))
    .catch(next);
}


export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий _id карточки`);
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
        throw new NotFoundError(`Передан несуществующий _id карточки`);
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
      ownerId: Joi.string().hex().length(24),
    }),
  })(req,res,next)
}

export const validateLike = async (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  })(req,res,next)
}
