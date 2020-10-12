import { Request, Response, NextFunction } from 'express';
import generateMetadata, {
  metadataCache,
  clearMetadataCache,
  Options,
  IconProps,
} from '../generateMetadata';

// ================================================================ //

const iconsMock = {
  favicons: {
    'favicon-16x16.png': {
      width: 16,
      height: 16,
      rel: 'icon',
      type: 'image/png',
      emitTag: true,
    },
  },
  appleStartup: {
    'iphone5-splash.png': {
      dwidth: 320,
      dheight: 568,
      ratio: 2,
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      emitTag: true,
    },
  },
} as { [group: string]: { [filename: string]: IconProps } };

const assetsManifestMock = {
  'assets/icons/favicon-16x16.png': '/assets/icons/favicon-16x16.png',
  'assets/icons/iphone5-splash.png': '/assets/icons/iphone5-splash.png',
  'manifest.json': '/manifest.json',
};

const metadataMock = '<link rel="manifest" href="/manifest.json"/>';

// ================================================================ //

describe('generateMetatada', () => {
  let req: Request;
  let res: Response;
  let next: jest.MockedFunction<NextFunction>;
  let consoleSpy: jest.SpyInstance;
  let opts: Options;

  beforeEach(() => {
    req = {} as Request;
    res = {
      locals: { getManifest: () => assetsManifestMock },
      metadata: metadataMock,
    } as any;
    next = jest.fn();
    opts = {
      appName: 'Test',
      appleStatusBarStyle: 'default',
      themeColor: '#ffffff',
      backgroundColor: '#ffffff',
      cache: false,
      icons: iconsMock,
    } as Options;
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => null);
  });

  afterEach(() => {
    clearMetadataCache();
    consoleSpy.mockRestore();
  });

  // ---------------------------------------------------- //

  it('exists', () => {
    expect(generateMetadata).toBeDefined();
  });

  it('returns a function', () => {
    expect(typeof generateMetadata).toBe('function');
  });

  it('calls next function', () => {
    generateMetadata(opts)(req, res, next);
    expect(next).toBeCalled();
  });

  it('throws an error if the assets manifest file do not exist', () => {
    const res = { locals: { getManifest: null } } as any;
    expect(() => generateMetadata(opts)(req, res, next)).toThrowError();
  });

  it("throws an error if the manifest file doesn't exist", () => {
    const res = { locals: { getManifest: () => ({}) } } as any;
    expect(() => generateMetadata(opts)(req, res, next)).toThrowError();
  });

  it('with no icon props', () => {
    opts.icons = undefined;
    expect(() => generateMetadata(opts)(req, res, next)).toThrowError();
  });

  it('does not emit the icon metatag', () => {
    const props = { rel: 'icon', type: 'image/png', emitTag: false };
    Object.assign(opts.icons?.favicons, {
      'favicon-16x16.png': props,
    });

    generateMetadata(opts)(req, res, next);
    const ref = assetsManifestMock['assets/icons/favicon-16x16.png'];
    const link = `<link rel="${props.rel}" type="${props.type}" href="${ref}"/>`;
    expect(res.locals.metadata.includes(link)).toBe(false);
  });

  it('displays a message on the console if an icon do not have a supported type property', () => {
    Object.assign(opts.icons?.favicons, {
      'favicon-16x16.png': {
        width: 16,
        height: 16,
        type: 'image/unknown',
        emitTag: true,
      },
    });

    generateMetadata(opts)(req, res, next);
    expect(consoleSpy).toBeCalled();
  });

  it('displays a message on the console if an icon do not have a rel property', () => {
    Object.assign(opts.icons?.favicons, {
      'favicon-16x16.png': {
        width: 16,
        height: 16,
        type: 'image/png',
        emitTag: true,
      },
    });

    generateMetadata(opts)(req, res, next);
    expect(consoleSpy).toBeCalled();
  });

  it('displays a message on the console if an icon do not have a ratio property', () => {
    Object.assign(opts.icons?.appleStartup, {
      'iphone5-splash.png': {
        dwidth: 320,
        dheight: 568,
        rel: 'apple-touch-startup-image',
        type: 'image/png',
        emitTag: true,
      },
    });

    generateMetadata(opts)(req, res, next);
    expect(consoleSpy).toBeCalled();
  });

  it('displays a message on the console if an icon do not have a size property', () => {
    // Modify a favicon in the icon props
    const props = { rel: 'icon', type: 'image/png', emitTag: true };
    Object.assign(opts.icons?.favicons, {
      'favicon-16x16.png': { ...props },
    });

    generateMetadata(opts)(req, res, next);
    const ref = assetsManifestMock['assets/icons/favicon-16x16.png'];
    const link = `<link rel="${props.rel}" type="${props.type}" href="${ref}"/>`;
    expect(res.locals.metadata.includes(link)).toBe(true);
    expect(consoleSpy).toBeCalled();
  });

  it('caches the metadata', () => {
    opts.cache = true;
    generateMetadata(opts)(req, res, next);
    expect(metadataCache).toBe(res.locals.metadata);
  });
});
