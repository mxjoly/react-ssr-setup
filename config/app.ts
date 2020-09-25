import fs from 'fs';
import chalk from 'chalk';

// https://developer.mozilla.org/fr/docs/Web/Manifest
export interface ManifestOptions {
  lang: string;
  dir: 'ltr' | 'rtl' | 'auto';
  name: string;
  short_name: string;
  description: string;
  icons: { src: string; sizes: string; type: string }[];
  scope: string;
  start_url: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation:
    | 'any'
    | 'natural'
    | 'landscape'
    | 'landscape-primary'
    | 'landscape-secondary'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary';
  theme_color: string;
  background_color: string;
  prefer_related_applications?: 'true' | 'false';
  related_application?: [{ platform: string; url: string; id?: string }];
}

let appManifest: ManifestOptions = null;

export const loadConfig = () => {
  if (process.env.PWA === 'true') {
    if (fs.existsSync('app.json')) {
      appManifest = require('../app.json');
    } else {
      console.log(
        chalk.yellowBright(
          chalk.bold('WARNING') +
            ' You have enabled progressive web app without creating a file named app.json at the root of the project.'
        )
      );
    }
  }
};

const defaultManifest: ManifestOptions = {
  lang: 'en',
  dir: 'auto',
  name: null,
  short_name: null,
  description: null,
  icons: [],
  scope: '/',
  start_url: '/?utm_source=homescreen',
  display: 'standalone',
  orientation: 'any',
  theme_color: '#ffffff',
  background_color: '#ffffff',
};

export default () => {
  if (!appManifest) {
    loadConfig();
  }
  return {
    ...defaultManifest,
    ...appManifest,
  };
};
