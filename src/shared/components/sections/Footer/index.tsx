import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

const Footer: React.FC<any> = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <p className="footer__text">
        {t('footer.content')}{' '}
        <a
          className="footer__author"
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

export default Footer;
