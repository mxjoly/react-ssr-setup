import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './App.scss';

import withLocale from './lib/i18n/withLocale';
import Header from './components/sections/Header';
import PageContent from './components/sections/Content';
import Footer from './components/sections/Footer';

const App: React.FC<any> = () => {
  const { i18n } = useTranslation();
  return (
    <>
      <Helmet
        defaultTitle="React SSR Starter"
        titleTemplate="%s – React SSR Starter"
      >
        <html lang={i18n.language} />
      </Helmet>
      <Header />
      <PageContent />
      <Footer />
    </>
  );
};

export default withLocale(App);
