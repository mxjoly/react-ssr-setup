import { Locale } from '../store/app/types';

const isBrowser = typeof window !== 'undefined';

const locales: Locale[] = ['en', 'fr'];
const namespaces = ['common', 'pages'];

const getResources = () => {
  const resources: any = {};
  for (const locale of locales) {
    resources[locale] = {};
    for (const ns of namespaces) {
      resources[locale][ns] = require(`./locales/${locale}/${ns}.json`);
    }
  }
  return resources;
};

const config: any = {
  defaultNS: 'common',
  fallbackNS: namespaces,
  ns: namespaces,

  fallbackLng: locales[0],
  supportedLngs: locales,
  preload: locales,
  load: 'languageOnly',

  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },

  resources: getResources(),

  // This option is necessary to tell i18next to try loading missing resources via
  // i18next-http-backend, otherwise no calls will be made if resources are defined.
  partialBundledLanguages: true,

  detection: {
    // order and from where user language should be detected
    order: [
      'path',
      // 'querystring',
      'cookie',
      'localStorage',
      'sessionStorage',
      'navigator',
      // 'htmlTag',
      // 'subdomain',
    ],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
  },

  debug: process.env.NODE_ENV === 'development' && isBrowser,

  parseMissingKeyHandler: (missing: any) => {
    if (process.env.NODE_ENV === 'development' && isBrowser) {
      console.warn('Missing translation :', missing);
    }
    return missing;
  },
};

export default config;
