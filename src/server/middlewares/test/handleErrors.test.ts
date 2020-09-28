import { Request, Response } from 'express';
import handleErrors from '../handleErrors';

// ================================================================ //

const OLD_ENV = process.env;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockImplementation((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ================================================================ //

describe('handleErrors', () => {
  let err: Error;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
    err = { name: 'Error', message: 'Error', stack: '' };
    req = {} as Request;
    res = mockResponse();
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  // ---------------------------------------------------- //

  it('exists', () => {
    expect(handleErrors).toBeDefined();
  });

  it('returns a function', () => {
    expect(typeof handleErrors).toBe('function');
  });

  it('responds with status code 500', () => {
    process.env.NODE_ENV = 'development';
    handleErrors(err, req, res, () => {
      expect(res.statusCode).toBe(500);
    });
  });
});
