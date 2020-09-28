import { Request, Response, NextFunction } from 'express';
import addStore from '../addStore';

describe('addStore', () => {
  let req: Request;
  let res: Response;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {} as Request;
    res = { locals: {} } as Response;
    next = jest.fn();
    addStore(req, res, next);
  });

  // ---------------------------------------------------- //

  it('exists', () => {
    expect(addStore).toBeDefined();
  });

  it('returns a function', () => {
    expect(typeof addStore).toBe('function');
  });

  it('calls next function', () => {
    expect(next).toBeCalled();
  });

  it('should add the store to the response', () => {
    expect(res.locals.store).toBeDefined();
  });
});
