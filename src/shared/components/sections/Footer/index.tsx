import React from 'react';
import './style.scss';

const Footer: React.FC<any> = () => {
  return (
    <footer className="footer">
      <p className="footer__text">
        Designed with ❤️ by{' '}
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
