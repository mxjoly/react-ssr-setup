import React from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore, useSelector } from 'react-redux';
import { parse } from 'query-string';

import config from '../config';
import { getLocale } from '../../store/app/selectors';
import { ActionTypes } from '../../store/app/actions';
import findBestLocale from './findBestLocale';

/**
 * Format the url to contains a valid locale in the query, and sync i18n language
 * with redux store and the query
 * @param WrappedComponent - The component wrapped
 */
const withIntl = (WrappedComponent: React.FC<any>) => {
  const IntlComponent = (props: any) => {
    const { i18n } = useTranslation();
    const { pathname, search } = useLocation();
    const history = useHistory();
    const store = useStore();
    const locale = useSelector(getLocale);

    const parsedQuery = parse(search);
    const parsedLocale = parsedQuery[config.detection.lookupQuerystring];

    // Sync the i18n language with the locale in the store
    React.useEffect(() => {
      if (locale !== i18n.language && locale !== null) {
        const query = search.replace(`lng=${i18n.language}`, `lng=${locale}`);
        i18n.changeLanguage(locale);
        history.push(pathname + query);
      }
    }, [locale]);

    // Sync the locale in the redux store with the locale in the url
    React.useEffect(() => {
      if (
        locale !== parsedLocale &&
        config.supportedLngs.includes(parsedLocale)
      ) {
        store.dispatch({
          type: ActionTypes.SET_LOCALE,
          payload: parsedLocale,
        });
      }
    }, [history.location]);

    // If the locale is not in the query, we push it
    if (!parsedLocale && parsedLocale !== '') {
      const bestLocale = findBestLocale(['navigator']);
      const query =
        search !== '' ? search + `&lng=${bestLocale}` : `?lng=${bestLocale}`;

      if (pathname.endsWith('/')) {
        return <Redirect to={pathname + query} />;
      } else {
        return <Redirect to={pathname + '/' + query} />;
      }
    }
    // Otherwise, we verify if the locale specified is valid
    else {
      if (!config.supportedLngs.includes(parsedLocale)) {
        const bestLocale = findBestLocale(['navigator']);
        const query = search.replace(
          `${config.detection.lookupQuerystring}=${parsedLocale}`,
          `${config.detection.lookupQuerystring}=${bestLocale}`
        );
        return <Redirect to={pathname + query} />;
      }
    }

    return <WrappedComponent {...props} />;
  };

  return IntlComponent;
};

export default withIntl;
