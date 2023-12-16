import { Router } from 'express'
import { cardsRouter } from './cards'
import { usersRouter } from './users'

export const router: Router = Router()

cardsRouter(router)
usersRouter(router)
