import { Router, Request, Response } from 'express';
import {
  get,
  getUser,
  getUserMe,
  signInUser,
  signUpUser,
  patchUser,
  patchAvatar,
  validateUser,
  validateAvatar
} from '../controllers/users'
import {
  USERS_ROUTE,
  GET_USERS_ROUTE,
  GET_USER_ROUTE,
  GET_USER_ME_ROUTE,
  SIGNIN_USER_ROUTE,
  SIGNUP_USER_ROUTE,
  PATCH_USER_ROUTE,
  PATCH_AVATAR_ROUTE
} from './routes'
import auth from '../middlewares/auth';


export const usersRouter = (router: Router) => {
  const usersRouter: Router = Router()

  router.use(USERS_ROUTE, usersRouter)

  usersRouter
    .post(SIGNIN_USER_ROUTE, validateUser, signInUser)
    .post(SIGNUP_USER_ROUTE, validateUser, signUpUser)
    .use(auth)
    .get(GET_USERS_ROUTE, get)
    .get(GET_USER_ME_ROUTE, getUserMe)
    .get(GET_USER_ROUTE, getUser)
    .patch(PATCH_USER_ROUTE, validateUser, patchUser)
    .patch(PATCH_AVATAR_ROUTE, validateAvatar, patchAvatar)
}

