import { Request, Response } from 'express';
import mockStore from 'redux-mock-store';
import renderFullPage from '../renderFullPage';

// ================================================================ //

jest.mock('react-i18next', () => ({
  ...(jest.requireActual('react-i18next') as any),
  useTranslation: () => ({
    i18n: {
      t: jest.fn(),
      language: 'en',
    },
  }),
}));

jest.mock('../../../shared/lib/store/app/selectors', () => ({
  getLocale: () => 'en',
}));

const mockRequest = () => ({
  url: 'https://example.com/some/url',
  i18n: {
    languages: ['en', 'fr'],
    language: 'en',
    services: { resourceStore: { data: {} } },
  },
});

const mockResponse = () => {
  const res = {} as Response;
  res.send = jest.fn().mockImplementation((values) => values);
  res.locals = {
    store: mockStore([])({}),
    assetPath: jest.fn(),
  };
  res.status = jest.fn().mockImplementation((code) => {
    res.statusCode = code;
    return res;
  });
  return res;
};

const OLD_ENV = process.env;

// ================================================================ //

describe('renderFullPage', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = mockRequest() as any;
    res = mockResponse() as any;
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
    jest.resetModules();
  });

  // ---------------------------------------------------- //

  it('exists', () => {
    expect(renderFullPage).toBeDefined();
  });

  it('returns a function', () => {
    expect(typeof renderFullPage).toBe('function');
  });

  it('responds with the status 200 for common website', () => {
    process.env = { ...OLD_ENV, PWA: 'false' };
    renderFullPage()(req, res);
    expect(res.statusCode).toBe(200);
  });

  it('responds with the status 200 for pwa', () => {
    process.env = { ...OLD_ENV, PWA: 'true' };
    renderFullPage()(req, res);
    expect(res.statusCode).toBe(200);
  });

  it('returns the html content', () => {
    const result: any = renderFullPage()(req, res);
    const expectedHtml = /^<!doctype\shtml><html(\s?[\w-]+=".*")*><head>(.|\n)*<\/head><body>(.|\n)*<\/body><\/html>$/i;
    expect(expectedHtml.test(result)).toBe(true);
  });
});
