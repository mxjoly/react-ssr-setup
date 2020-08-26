import React from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore, useSelector } from 'react-redux';

import config from './config';
import { getLocale } from '../redux/store/app/selectors';
import { setLocale } from '../redux/store/app/actions';
import { Locale } from '../redux/store/app/types';

/**
 * Format the url to contain a valid locale in the query, and sync i18n language
 * with redux store and the query
 */
const withLocale = (WrappedComponent: React.FC<any>) => {
  const LocalizedComponent = () => {
    const { i18n } = useTranslation();
    const { pathname, search } = useLocation();
    const store = useStore();
    const storeLocale = useSelector(getLocale);
    const history = useHistory();

    // Sync the i18n language, the locale in the store and the locale in the url
    React.useEffect(() => {
      if (storeLocale !== i18n.language) {
        store.dispatch(setLocale(i18n.language as Locale));
      }
      const curLocale = pathname.split('/')[1];
      if (curLocale !== i18n.language && curLocale) {
        history.replace(pathname.replace(curLocale, i18n.language) + search);
      }
    }, [i18n.language, storeLocale, history, pathname, search, store]);

    const curLocale = pathname.split('/')[1];
    if (!config.supportedLngs.includes(curLocale)) {
      return (
        <Redirect to={pathname.replace(curLocale, i18n.language) + search} />
      );
    } else if (!pathname.endsWith('/')) {
      // Add a trailing to the url route
      return <Redirect to={pathname.concat('/') + search} />;
    }

    return <WrappedComponent />;
  };

  return LocalizedComponent;
};

export default withLocale;
