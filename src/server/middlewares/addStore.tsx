import { Request, Response, NextFunction } from 'express';
import { configureStore } from '../../shared/store';

const addStore = (_req: Request, res: Response, next: NextFunction) => {
  res.locals.store = configureStore({});
  next();
};

export default addStore;
