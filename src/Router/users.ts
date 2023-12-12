import { Router, Request, Response } from 'express';
import {
  get,
  getUser,
  post,
  patchUser,
  patchAvatar,
  validateUser,
  validateAvatar
} from '../controllers/users'
import {
  USERS_ROUTE,
  GET_USERS_ROUTE,
  GET_USER_ROUTE,
  POST_USERS_ROUTE,
  PATCH_USER_ROUTE,
  PATCH_AVATAR_ROUTE
} from './routes'

const { celebrate, Joi, Segments } = require('celebrate');



export const usersRouter = (router: Router) => {
  const usersRouter: Router = Router()

  router.use(USERS_ROUTE, usersRouter)

  usersRouter
    .get(GET_USERS_ROUTE, get)
    .get(GET_USER_ROUTE, getUser)
    .post(POST_USERS_ROUTE, validateUser, post)
    .patch(PATCH_USER_ROUTE, validateUser, patchUser)
    .patch(PATCH_AVATAR_ROUTE, validateAvatar, patchAvatar)
}

