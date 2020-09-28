import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import manifestHelpers, {
  manifestCache,
  clearManifestCache,
  assetPath,
  getSources,
  getStylesheetSources,
  getStylesheets,
  getJavascriptSources,
  getJavascripts,
  getImageSources,
  getImages,
  getManifest,
} from '../manifestHelpers';

// ================================================================ //

const manifestPath = 'some/path/manifest.json';
const javascripts = {
  'file.js': 'file.5678.min.js',
  'file2.js': 'file.1234.min.js',
};
const stylesheets = {
  'file3.css': 'file.2345.min.css',
};
const images = {
  'test.jpg': 'test.1234.jpg',
  'test.jpeg': 'test.1234.jpeg',
  'test.gif': 'test.1234.gif',
  'test.png': 'test.1234.png',
  'test.bmp': 'test.1234.bmp',
  'test.webp': 'test.1234.webp',
};
const manifestMock: { [key: string]: string } = Object.assign(
  {},
  javascripts,
  stylesheets,
  images
);

// ================================================================ //

describe('manifestHelpers', () => {
  let req: Request;
  let res: Response;
  let next: jest.MockedFunction<NextFunction>;
  let existsSpy: jest.SpyInstance;
  let readFileSpy: jest.SpyInstance;

  beforeEach(() => {
    existsSpy = jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    readFileSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(() => JSON.stringify(manifestMock));
  });

  beforeEach(() => {
    req = {} as Request;
    res = { locals: {} } as Response;
    next = jest.fn();
    manifestHelpers({ manifestPath })(req, res, next);
  });

  afterEach(() => {
    clearManifestCache();
    existsSpy.mockRestore();
    readFileSpy.mockRestore();
  });

  // ---------------------------------------------------- //

  it('exists', () => {
    expect(manifestHelpers).toBeDefined();
  });

  it('calls next function', () => {
    expect(next).toBeCalled();
  });

  it('adds helpers to locals', () => {
    expect(res.locals.getSources).toBeDefined();
    expect(res.locals.getStylesheetSources).toBeDefined();
    expect(res.locals.getStylesheets).toBeDefined();
    expect(res.locals.getJavascriptSources).toBeDefined();
    expect(res.locals.getJavascripts).toBeDefined();
    expect(res.locals.getImageSources).toBeDefined();
    expect(res.locals.getImages).toBeDefined();
    expect(res.locals.getManifest).toBeDefined();
    expect(res.locals.assetPath).toBeDefined();
  });

  // ================================================================ //

  describe('#assetPath', () => {
    it('exists', () => {
      expect(assetPath).toBeDefined();
    });

    it('returns the right path to source file', () => {
      const source = 'file.js';
      const result = assetPath(source);
      expect(result).toBe(manifestMock[source]);
    });

    it('handles malformed input', () => {
      expect(assetPath('missing-file.js')).toBe(null);
      expect(assetPath(123 as any)).toBe(null);
      expect(assetPath(undefined as any)).toBe(null);
      expect(assetPath(null as any)).toBe(null);
    });
  });

  // ================================================================ //

  describe('#getters', () => {
    it('exists', () => {
      expect(getStylesheets).toBeDefined();
      expect(getJavascripts).toBeDefined();
      expect(getImages).toBeDefined();
      expect(getSources).toBeDefined();
    });

    it('returns the manifest', () => {
      expect(getManifest()).toStrictEqual(manifestMock);
    });

    it('throws an error if the manifest does not exist', () => {
      existsSpy.mockImplementation(() => false);
      expect(() => getManifest()).toThrowError();
    });

    it('caches the manifest', () => {
      getManifest();
      expect(manifestCache).toStrictEqual(manifestMock);
    });

    it('returns a list of all source files', () => {
      const sources = getSources();
      expect(sources).toStrictEqual(Object.keys(manifestMock));
    });

    it('returns a list of all javascript files', () => {
      const jsFiles = getJavascripts();
      const jsSources = getJavascriptSources();
      expect(jsFiles).toStrictEqual(Object.values(javascripts));
      expect(jsSources).toStrictEqual(Object.keys(javascripts));
    });

    it('returns a list of all css files', () => {
      const cssFiles = getStylesheets();
      const cssSources = getStylesheetSources();
      expect(cssFiles).toStrictEqual(Object.values(stylesheets));
      expect(cssSources).toStrictEqual(Object.keys(stylesheets));
    });

    it('returns a list of all image files', () => {
      const imgFiles = getImages();
      const imgSources = getImageSources();
      expect(imgFiles).toStrictEqual(Object.values(images));
      expect(imgSources).toStrictEqual(Object.keys(images));
    });
  });
});
