import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import favicon from './assets/favicon.png';
import './App.scss';

import i18n from './i18n';
import withLocale from './i18n/withLocale';
import { Locale } from './store/app/types';

import routes from './routes';
import Home from './pages/home';
import About from './pages/about';
import PageNotFound from './pages/404';

const App: React.FC<any> = () => {
  const { t } = useTranslation();

  const changeLocale = (newLocale: Locale) => {
    if (i18n.language !== newLocale) {
      i18n.changeLanguage(newLocale);
    }
  };

  return (
    <div className={'app'}>
      <Helmet
        defaultTitle="React SSR Starter"
        titleTemplate="%s – React SSR Starter"
        link={[{ rel: 'icon', type: 'image/png', href: favicon }]}
      />
      <h1>React + Express</h1>
      <ul>
        <li>
          <Link to={routes.home}>Home</Link>
        </li>
        <li>
          <Link to={routes.about}>About</Link>
        </li>
      </ul>
      <div className="page-content">
        <Switch>
          <Route exact path={routes.home} component={Home} />
          <Route exact path={routes.about} component={About} />
          <Route render={() => <PageNotFound />} />
        </Switch>
        <p>{t('test')}</p>
        <button onClick={() => changeLocale('en')}>En</button>
        <button onClick={() => changeLocale('fr')}>Fr</button>
      </div>
    </div>
  );
};

export default withLocale(App);
