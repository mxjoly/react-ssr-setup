import path from 'path';
import merge from 'lodash/merge';
import assign from 'lodash/assign';
import { Request, Response, NextFunction } from 'express';
import paths from '../../../config/paths';

// Values for the rel attribute of the link tag
type RelType =
  | 'icon'
  | 'apple-touch-icon'
  | 'apple-touch-startup-image'
  | 'shortcut icon';

type MimeType = 'image/gif' | 'image/jpeg' | 'image/png' | 'image/svg+xml';

type AppleStatusBarStyle = 'default' | 'black' | 'black-translucent';

export type IconProps = {
  width?: number;
  height?: number;
  dwidth?: number;
  dheight?: number;
  ratio?: number;
  rel?: RelType;
  type?: MimeType;
};

type Cache = {
  timestamp?: number;
  value?: any;
};

export interface Options {
  icons?: { [group: string]: { [filename: string]: IconProps } };
  cache?: boolean;
  appName?: string;
  themeColor?: string;
  backgroundColor?: string;
  appleStatusBarStyle?: AppleStatusBarStyle;
  ignorePatterns?: RegExp;
}

export const CACHE_TTL = 604800000; // One week in ms
export let cache: Cache = {};

const options: Options = {};

const isCached = () => (cache.timestamp && cache.value ? true : false);

const isCacheOutdated = () => {
  return cache.timestamp ? cache.timestamp + CACHE_TTL < Date.now() : false;
};

export const clearCache = () => {
  cache = {};
};

/**
 * Get the metadata for an icon as a string
 * @param iconName - The icon name
 * @param props - The props of this icon
 */
const getIconMetadata = (iconName: string, props: IconProps) => {
  const { publicPath, publicAssets } = paths;
  const ref = path.join(publicPath, publicAssets, 'icons', iconName);

  if (props.type === 'image/png') {
    if (!props.rel) {
      console.warn(`Cannot find the rel type for the image '${ref}'.`);
      return '';
    }

    if (props.dwidth && props.dheight) {
      if (!props.ratio) {
        console.warn(`Cannot find the ratio for the image '${ref}'.`);
        return '';
      }

      const media = `(device-width: ${props.dwidth}px) and (device-height: ${props.dheight}px) and (-webkit-device-pixel-ratio: ${props.ratio})`;
      return `<link rel="${props.rel}" type="${props.type}" media="${media}" href="${ref}"/>`;
    }
    if (props.width && props.height) {
      return `<link rel="${props.rel}" type="${props.type}" sizes="${props.width}x${props.height}" href="${ref}"/>`;
    }

    console.warn(`The image '${ref}' don't have its specified size.`);
    return `<link rel="${props.rel}" type="${props.type}" href="${ref}"/>`;
  }

  if (props.type === 'image/svg+xml') {
    return `<link rel="${props.rel}" type="${props.type}" href="${ref}"/>`;
  }

  console.warn(`Image type unsupported for '${ref}'.`);
  return '';
};

const generateMetadata = (opts?: Options) => {
  const defaultOptions = {
    icons: {},
    cache: true,
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
    appleStatusBarStyle: 'default',
  } as Options;

  assign(options, defaultOptions, opts);

  const iconOptions = options.icons || {};

  // Remove the group key level
  const iconsData = Object.keys(iconOptions).reduce((accumulator, group) => {
    Object.keys(iconOptions[group]).forEach((filename) => {
      accumulator[filename] = merge(iconOptions[group][filename], {
        group,
      });
    });
    return accumulator;
  }, {} as { [filename: string]: IconProps & { group: string } });

  return (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.getManifest) {
      const assetsManifest = res.locals.getManifest();
      const icons = Object.keys(assetsManifest)
        .filter((filename) =>
          filename.startsWith(path.join(paths.publicAssets, 'icons'))
        )
        .filter((filename) =>
          options.ignorePatterns ? !options.ignorePatterns.test(filename) : true
        );

      if (
        options.cache === true &&
        isCached() === true &&
        isCacheOutdated() === false
      ) {
        res.locals.metadata = cache.value;
      } else {
        const manifestRef = assetsManifest['manifest.json'];

        if (!manifestRef) {
          throw new Error(`Manifest file could not be found at ${manifestRef}`);
        }

        res.locals.metadata = icons
          .map((iconPath) => {
            const iconName = path.basename(iconPath);
            const iconProps = iconsData[iconName];
            return getIconMetadata(iconName, iconProps);
          })
          .concat([
            `<link rel="manifest" href="${manifestRef}"/>`,
            `<meta name="theme-color" content="${options.themeColor}"/>`,
            `<meta name="application-name" content="${options.appName}"/>`,
            `<meta name="mobile-web-app-capable" content="yes"/>`,
            `<meta name="apple-mobile-web-app-capable" content="yes"/>`,
            `<meta name="apple-mobile-web-app-title" content="${options.appName}"/>`,
            `<meta name="apple-mobile-web-app-status-bar-style" content="${options.appleStatusBarStyle}"/>`,
          ])
          .join('');

        if (options.cache === true) {
          cache = {
            timestamp: Date.now(),
            value: res.locals.metadata,
          };
        }
      }
    } else {
      throw new Error(
        'Assets manifest file could not be loaded to generate the metadata.'
      );
    }
    next();
  };
};

export default generateMetadata;
