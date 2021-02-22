import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { LanguageDetector } from 'i18next-http-middleware';
import { initReactI18next } from 'react-i18next';
import config from './config';

i18next.use(Backend).use(initReactI18next).use(LanguageDetector);

if (!i18next.isInitialized) {
  i18next.init(config);
  i18next.languages = config.supportedLngs;
}

export default i18next;
