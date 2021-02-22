import React from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore, useSelector } from 'react-redux';
import cookie from 'js-cookie';

import config from './config';
import { getLocale } from '../store/app/selectors';
import { setLocale } from '../store/app/actions';
import { Locale } from '../store/app/types';

/**
 * Format the url to contain a valid locale, and sync it to redux store and i18n language
 */
const withLocale = (WrappedComponent: React.FC) => {
  const LocalizedComponent = (props: any) => {
    const { i18n } = useTranslation();
    const { pathname, search } = useLocation();
    const store = useStore();
    const storeLocale = useSelector(getLocale);
    const history = useHistory();

    // Sync the i18n language, the locale in the store and the locale in the url
    React.useEffect(() => {
      if (storeLocale && storeLocale !== i18n.language) {
        store.dispatch(setLocale(i18n.language as Locale));
      }
      const curLocale = pathname.split('/')[1];
      if (curLocale && curLocale !== i18n.language) {
        // Replace the pathname without reloading the page and update the cookies
        history.replace(
          pathname
            .replace(curLocale, i18n.language)
            .concat(pathname.endsWith('/') ? '' : '/')
            .concat(search)
        );
      }
      if (
        config.detection.caches.includes('cookie') &&
        config.detection.order.includes('cookie') &&
        cookie.get(config.detection.lookupCookie) !== i18n.language
      ) {
        cookie.set(config.detection.lookupCookie, i18n.language);
      }
    }, [i18n.language, storeLocale, history, pathname, search, store]);

    if (pathname === '/') {
      return <Redirect to={`/${i18n.language}/`} />;
    }

    const curLocale = pathname.split('/')[1];

    if (config.supportedLngs.includes(curLocale)) {
      if (pathname.endsWith('/')) {
        return <WrappedComponent {...props} />;
      }
      return <Redirect to={pathname + '/' + search} />;
    }

    const to = pathname
      .replace(curLocale, i18n.language)
      .concat(pathname.endsWith('/') ? '' : '/')
      .concat(search);

    return <Redirect to={to} />;
  };

  return LocalizedComponent;
};

export default withLocale;
