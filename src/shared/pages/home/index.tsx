import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { RouteConfigComponentProps } from 'react-router-config';

const Home: React.FC<RouteConfigComponentProps> = ({
  route,
}: RouteConfigComponentProps) => {
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

export default React.memo(Home);
