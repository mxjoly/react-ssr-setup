import React from 'react';
import classnames from 'classnames';
import './LocaleSelect.scss';

import i18n from '../../i18n';
import config from '../../i18n/config';
import { Locale } from '../../store/app/types';

const LocaleSelect: React.FC<any> = () => {
  const [curlocale, setLocale] = React.useState<Locale | undefined>(undefined);
  const locales = config.supportedLngs.filter((e: any) => e !== 'cimode');

  React.useEffect(() => {
    setLocale(i18n.language as Locale);
  }, [i18n.language]);

  const changeLocale = (newLocale: Locale) => {
    if (i18n.language !== newLocale) {
      i18n.changeLanguage(newLocale);
    }
  };

  return (
    <div className="locale-select">
      {locales.map((locale: Locale) => {
        return (
          <button
            className={
              curlocale === locale
                ? classnames(
                    'locale-select__button',
                    'locale-select__button_active'
                  )
                : 'locale-select__button'
            }
            key={locale}
            onClick={() => changeLocale(locale)}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default LocaleSelect;
