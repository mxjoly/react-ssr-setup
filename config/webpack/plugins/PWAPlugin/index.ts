import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prettier from 'prettier';
import sharp from 'sharp';
import Jimp from 'jimp';
import xml2js from 'xml2js';
import merge from 'lodash/merge';
import webpack, { Compiler } from 'webpack';
import { ManifestOptions } from '../../../app';

const iconsMap = require('./icons.json');

// Device              Portrait size      Landscape size     Screen size        Pixel ratio
// iPhone SE            640px × 1136px    1136px ×  640px     320px ×  568px    2
// iPhone 8             750px × 1334px    1334px ×  750px     375px ×  667px    2
// iPhone 7             750px × 1334px    1334px ×  750px     375px ×  667px    2
// iPhone 6s            750px × 1334px    1334px ×  750px     375px ×  667px    2
// iPhone XR            828px × 1792px    1792px ×  828px     414px ×  896px    2
// iPhone XS           1125px × 2436px    2436px × 1125px     375px ×  812px    3
// iPhone X            1125px × 2436px    2436px × 1125px     375px ×  812px    3
// iPhone 8 Plus       1242px × 2208px    2208px × 1242px     414px ×  736px    3
// iPhone 7 Plus       1242px × 2208px    2208px × 1242px     414px ×  736px    3
// iPhone 6s Plus      1242px × 2208px    2208px × 1242px     414px ×  736px    3
// iPhone XS Max       1242px × 2688px    2688px × 1242px     414px ×  896px    3
// 9.7" iPad           1536px × 2048px    2048px × 1536px     768px × 1024px    2
// 10.2" iPad          1620px × 2160px    2160px x 1620px     810px × 1080px    2
// 7.9" iPad mini 4    1536px × 2048px    2048px × 1536px     768px × 1024px    2
// 10.5" iPad Pro      1668px × 2224px    2224px × 1668px     834px × 1112px    2
// 11" iPad Pro        1668px × 2388px    2388px × 1668px     834px × 1194px    2
// 12.9" iPad Pro      2048px × 2732px    2732px × 2048px    1024px × 1366px    2

type IconGroup =
  | 'favicons'
  | 'android'
  | 'apple'
  | 'appleStartup'
  | 'windows'
  | 'safari'
  | 'coast';

interface IconProps {
  width?: number;
  height?: number;
  dwidth?: number;
  dheight?: number;
  ratio?: number;
  transparent: boolean;
  mask: boolean;
  shadow: boolean;
}

interface PluginOpts {
  publicPath?: string;
  manifest?: {
    outputPath?: string;
    filename?: string;
    options?: ManifestOptions;
  };
  icons?: {
    favicon?: string; // svg icon for generating the other icons
    outputPath?: string;
    // see https://www.pikpng.com/pngl/m/112-1128234_the-preview-shown-before-your-site-is-ready.png
    backgroundColor?: string; // background color for the splash screen
    themeColor?: string; // theme color
    use?: {
      favicons?: boolean;
      android?: boolean;
      apple?: boolean;
      appleStartup?: boolean;
      windows?: boolean;
      safari?: boolean;
      coast?: boolean;
    };
  };
}

/**
 * Update the width, height and fill color of the svg
 * @param {string} svg - The content of the svg file as string
 * @param {Object} props - The props to set for the svg
 */
const adjustSvg = (
  svg: Buffer,
  props: { width: number; height: number; color?: string }
) => {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder();

  /**
   * Set all the properties of object
   * @param {Object} obj - The object to change
   * @param {string} attrName - The key name
   * @param {string|number} attrVal - The new value for the key
   */
  const setObjectProperty = (obj, attrName: string, attrVal: string) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object') {
        setObjectProperty(value, attrName, attrVal);
      } else if (Array.isArray(value)) {
        value.forEach((val) => setObjectProperty(val, attrName, attrVal));
      } else if (key === attrName) {
        obj[key] = attrVal;
      }
    });
  };

  return new Promise((resolve, reject) => {
    parser.parseString(svg.toString(), (err, obj) => {
      if (err) reject(err);
      // Set the attributes width and height to svg node
      if (props.width) obj.svg['$'].width = props.width;
      if (props.height) obj.svg['$'].height = props.height;

      // Set the fill color
      if (props.color) setObjectProperty(obj, 'fill', props.color);

      // Update the svg
      const svg = builder.buildObject(obj);
      resolve(Buffer.from(svg));
    });
  });
};

class PWAPlugin {
  options: PluginOpts;

  constructor(args?: PluginOpts) {
    this.options = merge(
      {
        publicPath: '/',
        manifest: {
          outputPath: '',
          filename: 'manifest.json',
          options: args.manifest.options,
        },
        icons: {
          outputPath: '/assets/icons',
          splashColor: '#ffffff',
          themeColor: '#ffffff',
          use: {
            favicons: true,
            android: true,
            apple: true,
            appleStartup: true,
            windows: true,
            safari: true,
            coast: true,
          },
        },
      },
      args || {}
    );
  }

  createManifest(compilation: webpack.compilation.Compilation) {
    const {
      publicPath,
      manifest: { filename, options, outputPath },
    } = this.options;

    // Relative path from the public path
    const outputFile = path.join(outputPath, filename);

    // Add the icons
    Object.entries(iconsMap.android).forEach(([iconName, props]: any) => {
      options.icons.push(
        Object.assign(
          {
            src: path.join(publicPath, outputPath, iconName),
            sizes: `${props.width}x${props.height}`,
            type: 'image/png',
          },
          props.mask === true ? { purpose: 'maskable' } : {}
        )
      );
    });

    // Manifest content
    const content = prettier.format(JSON.stringify(options), {
      parser: 'json',
    });

    const buffer = Buffer.from(content, 'utf-8');

    // Add file to the compilation assets
    compilation.assets[outputFile] = {
      source: () => buffer,
      size: () => buffer.length,
    };
  }

  createBrowserConfig(compilation: webpack.compilation.Compilation) {
    const {
      publicPath,
      icons: { use, outputPath, themeColor },
    } = this.options;

    if (use.windows === true) {
      const relPath = path.join(
        publicPath,
        outputPath.endsWith('/') ? outputPath.slice(0, -1) : outputPath
      );
      const source = prettier.format(
        `
      <?xml version="1.0" encoding="utf-8"?>
      <browserconfig>
        <msapplication>
          <tile>
            <square70x70logo src="${relPath}/mstile-70x70.png"/>
            <square150x150logo src="${relPath}/mstile-270x270.png"/>
            <square310x310logo src="${relPath}/mstile-310x310.png"/>
            <wide310x150logo src="${relPath}/mstile-310x150.png"/>
            <TileColor>${themeColor}</TileColor>
          </tile>
        </msapplication>
      </browserconfig>
      `,
        { parser: 'html' }
      );

      const buffer = Buffer.from(source, 'utf-8');

      compilation.assets['browserconfig.xml'] = {
        source: () => buffer,
        size: () => buffer.length,
      };
    }
  }

  generateGroupIcons(
    favicon: Buffer,
    group: IconGroup
  ): Promise<any>[] | undefined {
    const { outputPath, backgroundColor, themeColor } = this.options.icons;

    return Object.entries(iconsMap[group]).map(
      ([iconName, props]: [string, IconProps]) => {
        const relativePath = path.join(outputPath, iconName);

        return new Promise((resolve, reject) => {
          Jimp.read(favicon, (err, logo) => {
            if (err) reject(err);

            const width = props.width || props.dwidth * props.ratio;
            const height = props.height || props.dheight * props.ratio;

            // Create a background image
            new Jimp(
              width,
              height,
              group === 'appleStartup' ? backgroundColor : themeColor,
              async (err: Error, background: Jimp) => {
                if (err) reject(err);

                // Resize the logo
                const dim =
                  group === 'appleStartup'
                    ? Math.min(0.8 * width, 800)
                    : width !== height
                    ? Math.min(0.9 * width, 0.9 * height)
                    : width;

                // For maskable icon, the safe area corresponds to 80% of the dim
                const padding = props.mask ? (7 * dim) / 20 : dim / 10; // padding for mask = dim/4 + dim/10
                logo.resize(dim - padding, dim - padding);

                // Position of the logo
                const x = (width - dim) / 2 + padding / 2;
                const y = (height - dim) / 2 + padding / 2;

                // Make a composite image with the background and the logo
                background.composite(logo, x, y, {
                  mode: Jimp.BLEND_SOURCE_OVER,
                  opacitySource: 1,
                  opacityDest: props.transparent ? 0 : 1, // Transparency of the background
                });

                Jimp.read(path.join(__dirname, 'mask.png'), (err, mask) => {
                  if (err) reject(err);

                  // https://css-tricks.com/maskable-icons-android-adaptive-icons-for-your-pwa/
                  if (props.mask === true) {
                    mask.resize(width, height);
                    background.mask(mask, 0, 0);
                  }

                  if (props.shadow === true) {
                    background.shadow({
                      size: 1.02,
                      x: 0,
                      y: 0,
                      opacity: 0.5,
                      blur: 3,
                    });
                  }

                  background.getBufferAsync(Jimp.MIME_PNG).then((buffer) => {
                    resolve([relativePath, buffer]);
                  });
                });
              }
            );
          });
        });
      }
    );
  }

  generateIcons(compilation: webpack.compilation.Compilation) {
    const {
      publicPath,
      icons: { favicon, use, outputPath },
    } = this.options;

    if (!favicon || !fs.existsSync(favicon)) {
      console.warn(
        chalk.yellowBright(
          chalk.bold('ERROR') +
            ' Something went wrong generating the asset icons. No icons was gererated.'
        )
      );
      return Promise.resolve();
    }

    if (path.extname(favicon) !== '.svg') {
      console.warn(
        chalk.yellowBright(
          chalk.bold('ERROR') +
            ' You must use a svg file for your favicon. No icons was gererated.'
        )
      );
      return Promise.resolve();
    }

    const promises = [];
    const faviconBuffer = fs.readFileSync(favicon);

    promises.push(
      new Promise((resolve, reject) => {
        // Resize the svg
        adjustSvg(faviconBuffer, { width: 2000, height: 2000 })
          .then((svg: Buffer) => {
            // Convert to png
            return sharp(svg).png().toBuffer();
          })
          .then((png: Buffer) => {
            const promises = [];

            // Generation of all png files
            Object.keys(use)
              .filter((group) => group !== 'safari')
              .filter((group) => use[group] === true)
              .forEach((group: IconGroup) => {
                const groupPromises = this.generateGroupIcons(png, group);

                if (!groupPromises)
                  throw new Error(
                    `An unexpected error occured when generating the icons for the group ${group}.`
                  );

                groupPromises.forEach((promise) => {
                  promises.push(
                    Promise.resolve(promise).then(([relativePath, buffer]) => {
                      compilation.assets[relativePath] = {
                        source: () => buffer,
                        size: () => buffer.length,
                      };
                    })
                  );
                });
              });

            return Promise.all(promises);
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      })
    );

    // Generation of mask icon for safari
    if (use.safari === true) {
      promises.push(
        new Promise((resolve, reject) => {
          const relPath = path.join(
            publicPath.slice(1), // Remove the first slash
            outputPath.endsWith('/') ? outputPath.slice(0, -1) : outputPath
          );
          const file = path.join(relPath, 'safari-pinned-tab.svg');

          adjustSvg(faviconBuffer, { width: 16, height: 16, color: '#000' })
            .then((buffer: Buffer) => {
              compilation.assets[file] = {
                source: () => buffer,
                size: () => buffer.length,
              };
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        })
      );
    }

    return Promise.all(promises);
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('PWAPlugin', this.createManifest.bind(this));
    compiler.hooks.emit.tap('PWAPlugin', this.createBrowserConfig.bind(this));
    compiler.hooks.emit.tapPromise('PWAPlugin', this.generateIcons.bind(this));
  }
}

export default PWAPlugin;
