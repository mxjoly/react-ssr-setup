import cookie from 'cookie';
import config from '../config';

const isSupportedLocale = (locale: string) => {
  return config.supportedLngs.some((l: string) => l === locale);
};

const findWithNavigator = (
  ckeckAllSettings = true,
  checkWithRegion = false
) => {
  if (typeof window !== 'undefined') {
    const userLangs = navigator.languages;
    if (ckeckAllSettings) {
      for (let i = 0; i < userLangs.length; i++) {
        const locale = userLangs[i];
        if (!checkWithRegion && locale.length > 2) {
          continue;
        }
        if (isSupportedLocale(locale)) {
          console.log('Locale found with the navigator');
          return locale;
        }
      }
    }
    if (isSupportedLocale(navigator.language)) {
      console.log('Locale found with the navigator');
      return navigator.language;
    }
  }
  return undefined;
};

const findWithCookie = () => {
  if (typeof window !== 'undefined') {
    const cookies = cookie.parse(document.cookie);
    const locale = cookies[config.detection.lookupCookie];
    if (locale && isSupportedLocale(locale)) {
      console.log('Locale found with the cookies');
      return locale;
    }
  }
  return undefined;
};

const findWithLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const locale = localStorage.getItem(config.detection.lookupLocalStorage);
    if (locale && isSupportedLocale(locale)) {
      console.log('Locale found with the local storage');
      return locale;
    }
  }
  return undefined;
};

const findWithSessionStorage = () => {
  if (typeof window !== 'undefined') {
    const locale = sessionStorage.getItem(
      config.detection.lookupSessionStorage
    );
    if (locale && isSupportedLocale(locale)) {
      console.log('Locale found with the session storage');
      return locale;
    }
  }
  return undefined;
};

type SearchOptions = 'cookie' | 'localStorage' | 'sessionStorage' | 'navigator';

export default function findBestLocale(searchOptions: SearchOptions[] = []) {
  const findWithOption = (option: string) => {
    switch (option) {
      case 'cookie':
        return findWithCookie();
      case 'localStorage':
        return findWithLocalStorage();
      case 'sessionStorage':
        return findWithSessionStorage();
      case 'navigator':
        return findWithNavigator();
      default:
        // Ignore the invalid options
        return;
    }
  };

  // Search the best locale according to the ordered options
  for (const option of searchOptions) {
    const locale = findWithOption(option);
    if (locale) return locale;
  }
  return config.fallbackLng;
}
