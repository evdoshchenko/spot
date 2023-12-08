import { Router, Request, Response } from 'express';
import Film from '../models/film';

const router = Router();
router.get('/', (_req: Request, res: Response) => {
  return Film.find({})
    .then((films) => res.send({ data: films }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

// сработает при POST-запросе на URL /films
router.post('/', (req: Request, res: Response) => {
  const { title, genre } = req.body;

  return Film.create({ title, genre })
    .then((film) => res.send({ data: film }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

export default router;
