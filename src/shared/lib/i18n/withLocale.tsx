import React from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore, useSelector } from 'react-redux';
import { parse } from 'query-string';

import config from './config';
import { getLocale } from '../redux/app/selectors';
import { setLocale } from '../redux/app/actions';
import { Locale } from '../redux/app/types';

/**
 * Format the url to contain a valid locale in the query, and sync i18n language
 * with redux store and the query
 */
const withLocale = (WrappedComponent: React.FC<any>) => {
  const LocalizedComponent = () => {
    const { i18n } = useTranslation();
    const { pathname, search } = useLocation();
    const store = useStore();
    const locale = useSelector(getLocale);
    const history = useHistory();

    const parsedQuery = parse(search);
    const parsedLocale = parsedQuery[config.detection.lookupQuerystring];

    // Sync the i18n language, the locale in the store and the locale in the url
    React.useEffect(() => {
      if (locale !== i18n.language) {
        store.dispatch(setLocale(i18n.language as Locale));
      }
      if (parsedLocale && parsedLocale !== i18n.language) {
        const query = search.replace(
          `lng=${parsedLocale}`,
          `lng=${i18n.language}`
        );
        history.replace(pathname + query);
      }
    }, [i18n.language]);

    // If the locale is not in the query, we push it
    if (!parsedLocale) {
      const query =
        search !== ''
          ? search + `&lng=${i18n.language}`
          : `?lng=${i18n.language}`;

      if (pathname.endsWith('/')) {
        return <Redirect to={pathname + query} />;
      } else {
        return <Redirect to={pathname + '/' + query} />;
      }
    }
    // Otherwise, we verify if the locale specified is valid
    else {
      if (!config.supportedLngs.includes(parsedLocale)) {
        const query = search.replace(
          `${config.detection.lookupQuerystring}=${parsedLocale}`,
          `${config.detection.lookupQuerystring}=${i18n.language}`
        );
        return <Redirect to={pathname + query} />;
      }
    }

    return <WrappedComponent />;
  };

  return LocalizedComponent;
};

export default withLocale;
