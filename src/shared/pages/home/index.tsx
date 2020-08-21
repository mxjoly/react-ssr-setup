import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Home: React.FC<any> = () => {
  const { t } = useTranslation(['common']);
  return (
    <React.Fragment>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h2>{t('common:homepage-content')}</h2>
    </React.Fragment>
  );
};

export default Home;
