import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import assign from 'lodash/assign';

interface Options {
  manifestPath?: string;
  prependPath?: string;
  cache?: boolean;
}

export let manifestCache: any = null;
const options: Options = {};

export function clearManifestCache() {
  manifestCache = null;
}

function loadManifest() {
  if (manifestCache && options.cache) return manifestCache;

  if (options.manifestPath && fs.existsSync(options.manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(options.manifestPath, 'utf8'));
    if (options.cache) {
      manifestCache = manifest;
    }
    return manifest;
  }

  throw new Error('Assets Manifest could not be loaded.');
}

export function lookup(source: string) {
  const manifest = loadManifest();
  if (manifest[source]) return options.prependPath + manifest[source];
  return null;
}

export function getManifest() {
  return loadManifest();
}

export function getSources() {
  return Object.keys(loadManifest());
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
