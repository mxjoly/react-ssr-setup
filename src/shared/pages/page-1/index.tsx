import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Page: React.FC<any> = () => {
  const { t } = useTranslation(['common']);
  return (
    <React.Fragment>
      <Helmet>
        <title>Page 1</title>
      </Helmet>
      <h2>{t('common:page1-content')}</h2>
    </React.Fragment>
  );
};

export default Page;
