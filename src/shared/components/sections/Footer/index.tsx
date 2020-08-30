import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles.scss';

export const classNames = {
  ROOT: 'Footer',
  TEXT: 'Footer__Text',
  AUTHOR: 'Footer__Author',
};

const Footer: React.FC<any> = () => {
  const { t } = useTranslation();
  return (
    <footer className={classNames.ROOT}>
      <p className={classNames.TEXT}>
        {t('footer.content')}{' '}
        <a
          className={classNames.AUTHOR}
          href="https://github.com/mxjoly"
          target="_blank"
          rel="noreferrer"
        >
          Maxime Joly
        </a>
      </p>
    </footer>
  );
};

export default React.memo(Footer);
