import React from 'react';
import { useTranslation } from 'react-i18next';

import config from '../../../lib/i18n/config';
import { Locale } from '../../../lib/store/app/types';
import Menu from '../../molecules/Menu';

const LocaleSelect: React.FC<any> = () => {
  const { i18n } = useTranslation();
  const [curlocale, setLocale] = React.useState<Locale | undefined>();
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

export default React.memo(LocaleSelect);
