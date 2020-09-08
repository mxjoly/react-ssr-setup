import fs from 'fs';
import chalk from 'chalk';
import favicons, { FavIconResponse, Configuration } from 'favicons';
import paths from './paths';

let appConfig = null;

export const loadConfig = () => {
  if (process.env.PWA === 'true') {
    if (fs.existsSync('app.json')) {
      appConfig = require('../app.json');
    } else {
      console.log(
        chalk.yellow(
          chalk.bold('WARNING') +
            ' You have enabled progressive web app without creating a file named app.json at the root of the project.'
        )
      );
    }
  }
};

export let MetaData: string;
export const generateMetaData = () => {
  if (!appConfig) {
    loadConfig();
  }
  return favicons(paths.favicon, {
    ...defaultConfig,
    ...appConfig,
  }).then((response: FavIconResponse) => (MetaData = response.html.join('')));
};

const defaultConfig = {
  path: '/', // Path for overriding default icons path.
  appName: null, // Your application's name.
  appShortName: null, // Your application's short_name. Optional. If not set, appName will be used
  appDescription: null, // Your application's description.
  developerName: null, // Your (or your developer's) name.
  developerURL: null, // Your (or your developer's) URL.
  dir: 'auto', // Primary text direction for name, short_name, and description
  lang: 'en-US', // Primary language for name and short_name
  background: '#ffffff', // Background colour for flattened icons.
  theme_color: '#000000', // Theme color user for example in Android's task switcher.
  appleStatusBarStyle: 'default', // Style for Apple status bar: "black-translucent", "default", "black".
  display: 'standalone', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser".
  orientation: 'any', // Default orientation: "any", "natural", "portrait" or "landscape".
  scope: '/', // set of URLs that the browser considers within your app
  start_url: '/', // Start URL when launching the application from a device.
  version: '1.0', // Your application's version string.
  logging: false, // Print logs to console?
  pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
  loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that.
  icons: {
    android: true, // Create Android homescreen icon.
    appleIcon: true, // Create Apple touch icons.
    appleStartup: true, // Create Apple startup images.
    coast: true, // Create Opera Coast icon.
    favicons: true, // Create regular favicons.
    firefox: true, // Create Firefox OS icons.
    windows: true, // Create Windows 8 tile icons.
  },
} as Configuration;

export default () => {
  if (!appConfig) {
    loadConfig();
  }
  return {
    ...defaultConfig,
    ...appConfig,
  };
};
