import React from 'react';
import { Helmet } from 'react-helmet-async';
import favicon from './assets/favicon.png';
import './App.scss';

import withLocale from './lib/i18n/withLocale';
import Header from './components/sections/Header';
import PageContent from './components/sections/Content';
import Footer from './components/sections/Footer';

const App: React.FC<any> = () => {
  return (
    <React.Fragment>
      <Helmet
        defaultTitle="React SSR Starter"
        titleTemplate="%s – React SSR Starter"
        link={[{ rel: 'icon', type: 'image/png', href: favicon }]}
      />
      <Header />
      <PageContent />
      <Footer />
    </React.Fragment>
  );
};

export default withLocale(App);
