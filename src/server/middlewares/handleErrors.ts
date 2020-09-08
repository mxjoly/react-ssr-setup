import path from 'path';
import { Request, Response, NextFunction } from 'express';

const handleErrors = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  res.status(500).json({
    status: 'error',
    message: err.message,
    stack:
      process.env.NODE_ENV === 'development' &&
      (err.stack || '')
        .split('\n')
        .map((line: string) => line.trim())
        .map((line: string) => line.split(path.sep).join('/'))
        .map((line: string) =>
          line.replace(process.cwd().split(path.sep).join('/'), '.')
        ),
  });
};

export default handleErrors;
