import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactLogo from '../../../assets/react.svg';
import './styles.scss';

import LocaleSelect from '../../organisms/LocaleSelect';
import { Key, getPath } from '../../../routes';

export const classNames = {
  ROOT: 'Header',
  NAV: 'Header__Navigation',
  LOGO: 'Header__Logo',
  LINK: 'Header__Link',
  ACTIVE_LINK: 'Header__Link_active',
};

const RouteList = React.memo(
  ({ keys, locale }: { keys: Key[]; locale: string }) => {
    return (
      <ul>
        {keys.map((key) => {
          const path = getPath(key, { locale });
          /* istanbul ignore next */
          if (typeof path === 'string') {
            return (
              <li key={key}>
                <NavLink
                  exact
                  to={path}
                  className={classNames.LINK}
                  activeClassName={classNames.ACTIVE_LINK}
                >
                  {key}
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
    );
  }
);

const Header: React.FC<any> = () => {
  const { i18n } = useTranslation();
  return (
    <div className={classNames.ROOT}>
      <nav className={classNames.NAV}>
        <Link to={`/${i18n.language}/`}>
          <img className={classNames.LOGO} src={ReactLogo} alt="logo" />
        </Link>
        <RouteList
          keys={['page-1', 'page-2', 'page-3']}
          locale={i18n.language}
        />
      </nav>
      <LocaleSelect />
    </div>
  );
};

export default React.memo(Header);
