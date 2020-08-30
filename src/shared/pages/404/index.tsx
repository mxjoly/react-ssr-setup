import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { RouteConfigComponentProps } from 'react-router-config';

const PageNotFound: React.FC<RouteConfigComponentProps> = ({
  route,
}: RouteConfigComponentProps) => {
  const { t } = useTranslation('pages');
  return (
    <>
      <Helmet>
        <title>{t(`${route?.key}.meta.title`)}</title>
      </Helmet>
      <h2>{t(`${route?.key}.body.content`)}</h2>
    </>
  );
};

export default React.memo(PageNotFound);
