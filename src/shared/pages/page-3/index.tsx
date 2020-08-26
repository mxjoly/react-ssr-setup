import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Page, PageProps } from '../type';

const Page3: Page<PageProps> = ({ route }: PageProps) => {
  const { t } = useTranslation('pages');
  return (
    <>
      <Helmet>
        <title>{t(`${route?.key}.meta.title`)}</title>
        <meta
          name="description"
          content={t(`${route?.key}.meta.description`)}
        />
      </Helmet>
      <h2>{t(`${route?.key}.body.content`)}</h2>
    </>
  );
};

export default Page3 as React.FunctionComponent;
