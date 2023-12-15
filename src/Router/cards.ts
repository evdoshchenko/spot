import { Router } from 'express';
import {
  get,
  getCard,
  deleteCard,
  post,
  likeCard,
  dislikeCard,
  validateCard,
  validateLike
} from '../controllers/cards'
import {
  CARDS_ROUTE,
  GET_CARDS_ROUTE,
  GET_CARD_ROUTE,
  DELETE_CARD_ROUTE,
  POST_CARDS_ROUTE,
  PUT_LIKE_ROUTE,
  DELETE_LIKE_ROUTE,
} from './routes'
import auth from '../middlewares/auth';


export const cardsRouter = (router: Router) => {
  const cardsRouter: Router = Router()

  router.use(CARDS_ROUTE, cardsRouter)

  cardsRouter
    .use(auth)
    .get(GET_CARDS_ROUTE, get)
    .get(GET_CARD_ROUTE, getCard)
    .delete(DELETE_CARD_ROUTE, deleteCard)
    .post(POST_CARDS_ROUTE, validateCard, post)
    .put(PUT_LIKE_ROUTE, validateLike, likeCard)
    .delete(DELETE_LIKE_ROUTE, validateLike, dislikeCard)
}



