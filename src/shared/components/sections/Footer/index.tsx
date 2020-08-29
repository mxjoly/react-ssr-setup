import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles.scss';

const Footer: React.FC<any> = () => {
  const { t } = useTranslation();
  return (
    <footer className="Footer">
      <p className="Footer__Text">
        {t('footer.content')}{' '}
        <a
          className="Footer__Author"
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
