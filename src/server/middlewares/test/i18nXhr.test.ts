import fs from 'fs';
import { Request, Response } from 'express';

import i18nextXhr, {
  translationCache,
  clearTranslationCache,
} from '../i18nXhr';
import config from '../../../shared/lib/i18n/config';
import paths from '../../../../config/paths';
import { Locale } from '../../../shared/lib/store/app/types';

// ================================================================ //

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockImplementation((code) => {
    res.statusCode = code;
    return res;
  });
  res.send = jest.fn().mockImplementation((values) => values);
  res.header = jest.fn().mockReturnValue(res);
  return res;
};

const TIMESTAMP1 = 1599503016;
const TIMESTAMP2 = 1599503338;

// ================================================================ //

describe('i18nXhr', () => {
  let req: Request;
  let res: Response;
  let locale: Locale;
  let ns: string;
  let expected: string; // expected Translations
  let dateSpy: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    req = { params: { locale, ns } } as Request<any>;
    res = mockResponse();
    locale = config.fallbackLng as Locale;
    ns = config.defaultNS as string;
    expected = fs.readFileSync(`${paths.locales}/${locale}/${ns}.json`, {
      encoding: 'utf-8',
    });
  });

  beforeEach(() => {
    dateSpy = jest
      .spyOn(Date.prototype, 'getTime')
      .mockImplementation(() => TIMESTAMP1);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => null);
  });

  afterEach(() => {
    clearTranslationCache();
    dateSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  // ---------------------------------------------------- //

  it('exists', () => {
    expect(i18nextXhr).toBeDefined();
  });

  it('returns a function', () => {
    expect(typeof i18nextXhr).toBe('function');
  });

  it('responds with status 200', () => {
    i18nextXhr(req, res, () => {
      expect(res.statusCode).toBe(200);
    });
  });

  it('handles the bad request', () => {
    const badRequests = [
      { params: { locale: '--', ns: '--' } },
      { params: { locale: '--' } },
      { params: { ns: '--' } },
      { params: {} },
    ] as Request[];
    badRequests.forEach((req) => {
      i18nextXhr(req, res, () => expect(req.statusCode).toBe(404));
    });
  });

  it('returns the right translations and cache them after', () => {
    const received = i18nextXhr(req, res);
    expect(received).toBe(expected);
    expect(translationCache).toStrictEqual({
      [locale]: {
        [ns]: {
          values: expected,
          updatedAt: TIMESTAMP1,
        },
      },
    });
  });

  it('updates the cache', () => {
    i18nextXhr(req, res);
    dateSpy.mockImplementation(() => TIMESTAMP2);
    i18nextXhr(req, res);
    expect(translationCache).toStrictEqual({
      [locale]: {
        [ns]: {
          values: expected,
          updatedAt: TIMESTAMP2,
        },
      },
    });
  });

  it('updates not the cache', () => {
    dateSpy.mockImplementation(() => TIMESTAMP2);
    i18nextXhr(req, res);
    dateSpy.mockImplementation(() => TIMESTAMP1);
    i18nextXhr(req, res);
    expect(translationCache).toStrictEqual({
      [locale]: {
        [ns]: {
          values: expected,
          updatedAt: TIMESTAMP2,
        },
      },
    });
  });
});
