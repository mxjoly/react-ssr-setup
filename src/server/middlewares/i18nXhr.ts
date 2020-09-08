import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import paths from '../../../config/paths';

type TranslationCache = {
  [locale: string]: {
    [ns: string]: {
      values: any;
      updatedAt: number;
    };
  };
};

export let translationCache: TranslationCache = {};

/* istanbul ignore next */
const localesDir =
  process.env.NODE_ENV === 'test' ? paths.locales : `${__dirname}/locales`;

export const clearTranslationCache = () => {
  translationCache = {};
};

const isCached = (locale: string, ns: string) =>
  translationCache[locale] && translationCache[locale][ns] ? true : false;

const isOutdated = (locale: string, ns: string) =>
  translationCache[locale] &&
  translationCache[locale][ns] &&
  translationCache[locale][ns].updatedAt <
    new Date(
      fs.statSync(path.resolve(`${localesDir}/${locale}/${ns}.json`)).mtime
    ).getTime()
    ? true
    : false;

const loadAndCache = (locale: string, ns: string) => {
  translationCache[locale] = {
    [ns]: {
      values: fs.readFileSync(`${localesDir}/${locale}/${ns}.json`, {
        encoding: 'utf-8',
      }),
      updatedAt: new Date(
        fs.statSync(path.resolve(`${localesDir}/${locale}/${ns}.json`)).mtime
      ).getTime(),
    },
  };
};

const getTranslation = (locale: string, ns: string) =>
  translationCache[locale][ns];

// This middleware serves translation files requested via /locales/:locale/:ns
export default (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next?: NextFunction
) => {
  try {
    if (!req.params.locale || !req.params.ns) {
      throw new Error(
        'Something went wrong when trying to get the locale and namespace from the request'
      );
    }

    const { locale, ns } = req.params;

    if (isCached(locale, ns) === false || isOutdated(locale, ns) === true) {
      loadAndCache(locale, ns);
    }

    const { values, updatedAt } = getTranslation(locale, ns);

    return res
      .header('Content-Type', 'application/json')
      .header('Last-Modified', new Date(updatedAt).toUTCString())
      .status(200)
      .send(values);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send(null);
  }
};
