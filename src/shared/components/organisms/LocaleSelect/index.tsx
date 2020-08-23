import React from 'react';

import i18n from '../../../lib/i18n';
import config from '../../../lib/i18n/config';
import { Locale } from '../../../lib/redux/app/types';
import Menu from '../../molecules/Menu';

const LocaleSelect: React.FC<any> = () => {
  const [curlocale, setLocale] = React.useState<Locale | undefined>(undefined);
  const locales = config.supportedLngs.filter((e: any) => e !== 'cimode');

  React.useEffect(() => {
    setLocale(i18n.language as Locale);
  }, [i18n.language]);

  const changeLocale = (newLocale: string) => {
    if (i18n.language !== newLocale) {
      i18n.changeLanguage(newLocale);
    }
  };

  return (
    <Menu
      defaultItem={curlocale}
      items={locales}
      onSelect={changeLocale}
      uppercase
    />
  );
};

export default LocaleSelect;
