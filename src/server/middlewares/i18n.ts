import fs from 'fs';
import path from 'path';
import express from 'express';

type TranslationCache = {
  [locale: string]: {
    [ns: string]: {
      values: any;
      updatedAt: number;
    };
  };
};

const translationCache: TranslationCache = {};

const localesDir = `${__dirname}/locales`;

const isCached = (locale: string, ns: string) =>
  translationCache[locale] && translationCache[locale][ns];

const isOutdated = (locale: string, ns: string) =>
  translationCache[locale] &&
  translationCache[locale][ns] &&
  translationCache[locale][ns].updatedAt <
    new Date(
      fs.statSync(path.resolve(`${localesDir}/${locale}/${ns}.json`)).mtime
    ).getTime();

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
export const i18nextXhr = (req: express.Request, res: express.Response) => {
  const { locale, ns } = req.params;

  try {
    if (!isCached(locale, ns) || isOutdated(locale, ns)) {
      loadAndCache(locale, ns);
    }

    const { values, updatedAt } = getTranslation(locale, ns);

    return res
      .header('Last-Modified', new Date(updatedAt).toUTCString())
      .send(values);
  } catch (error) {
    console.log(error.message);
    return res.send(null);
  }
};
