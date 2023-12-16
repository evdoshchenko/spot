import type { Request, Response, NextFunction } from 'express'

export const authToken = async (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65778b5603b38353c016521b'
  };

  next();
}
