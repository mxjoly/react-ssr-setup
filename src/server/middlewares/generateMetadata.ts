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
  emitTag?: boolean;
};

export interface Options {
  icons?: { [group: string]: { [filename: string]: IconProps } };
  cache?: boolean;
  appName?: string;
  themeColor?: string;
  backgroundColor?: string;
  appleStatusBarStyle?: AppleStatusBarStyle;
}

export let metadataCache: any = null;

const options: Options = {};

/**
 * Clear the cache
 */
export const clearMetadataCache = () => {
  metadataCache = null;
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
  const defaults: Options = {
    icons: {},
    cache: true,
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
    appleStatusBarStyle: 'default',
  };

  assign(options, defaults, opts);

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
      const icons = Object.keys(assetsManifest).filter((filename) =>
        filename.startsWith(path.join(paths.publicAssets, 'icons'))
      );

      if (options.cache && metadataCache) {
        res.locals.metadata = metadataCache;
      } else {
        const manifestRef = assetsManifest['manifest.json'];
        const browserConfigRef = assetsManifest['browserconfig.xml'];

        if (!manifestRef) {
          throw new Error(`Manifest file could not be found at ${manifestRef}`);
        }

        res.locals.metadata = icons
          .map((iconPath) => {
            const iconName = path.basename(iconPath);
            const iconProps = iconsData[iconName];
            return iconProps.emitTag
              ? getIconMetadata(iconName, iconProps)
              : '';
          })
          .concat([
            `<link rel="manifest" href="${manifestRef}"/>`,
            `<meta name="msapplication-config" content="${browserConfigRef}" />`,
            `<meta name="theme-color" content="${options.themeColor}"/>`,
            `<meta name="application-name" content="${options.appName}"/>`,
            '<meta name="mobile-web-app-capable" content="yes"/>',
            '<meta name="apple-mobile-web-app-capable" content="yes"/>',
            `<meta name="apple-mobile-web-app-title" content="${options.appName}"/>`,
            `<meta name="apple-mobile-web-app-status-bar-style" content="${options.appleStatusBarStyle}"/>`,
          ])
          .join('');

        if (options.cache) {
          metadataCache = res.locals.metadata;
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
