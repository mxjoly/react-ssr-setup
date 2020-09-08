import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import assign from 'lodash/assign';

interface Options {
  manifestPath?: string;
  prependPath?: string;
  cache?: boolean;
}

let manifest: any;
const options: Options = {};

function loadManifest() {
  if (manifest && options.cache) return manifest;

  if (options.manifestPath && fs.existsSync(options.manifestPath)) {
    return JSON.parse(fs.readFileSync(options.manifestPath, 'utf8'));
  } else {
    throw new Error('Asset Manifest could not be loaded.');
  }
}

export function lookup(source: string) {
  manifest = loadManifest();

  if (manifest[source]) return options.prependPath + manifest[source];
  else return null;
}

export function getManifest() {
  return manifest || loadManifest();
}

export function getSources() {
  manifest = manifest || loadManifest();
  return Object.keys(manifest);
}

export function getStylesheetSources() {
  return getSources().filter((file) => file.match(/\.css$/));
}

export function getStylesheets() {
  return getStylesheetSources().map((source) => lookup(source));
}

export function getJavascriptSources() {
  return getSources().filter((file) => file.match(/\.js$/));
}

export function getJavascripts() {
  return getJavascriptSources().map((source) => lookup(source));
}

export function getImageSources() {
  return getSources().filter((file) =>
    file.match(/\.(png|jpe?g|gif|webp|bmp)$/)
  );
}

export function getImages() {
  return getImageSources().map((source) => lookup(source));
}

export function assetPath(source: string) {
  return lookup(source);
}

export default function (opts: Options) {
  const defaults = {
    cache: true,
    prependPath: '',
  };

  manifest = null;
  assign(options, defaults, opts);

  return function (_req: Request, res: Response, next: NextFunction) {
    res.locals.getSources = getSources;
    res.locals.getStylesheetSources = getStylesheetSources;
    res.locals.getStylesheets = getStylesheets;
    res.locals.getJavascriptSources = getJavascriptSources;
    res.locals.getJavascripts = getJavascripts;
    res.locals.getImageSources = getImageSources;
    res.locals.getImages = getImages;
    res.locals.getManifest = getManifest;
    res.locals.assetPath = assetPath;
    next();
  };
}
