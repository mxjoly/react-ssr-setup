import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import LocaleSelect from '.';
import config from '../../../lib/i18n/config';
import i18n from '../../../lib/i18n';

describe('<LocaleSelect />', () => {
  let component: ShallowWrapper;
  let useEffectSpy: jest.SpyInstance;

  beforeEach(() => {
    useEffectSpy = jest
      .spyOn(React, 'useEffect')
      .mockImplementation((f) => f());
    component = shallow(<LocaleSelect />);
  });

  afterEach(() => {
    useEffectSpy.mockRestore();
  });

  // ---------------------------------------------------- //

  it('renders without errors', () => {
    expect(component.find('Menu')).toHaveLength(1);
  });

  it('matches its reference snapshot', () => {
    expect(component.html()).toMatchSnapshot();
  });

  it('has undefined locale at initialization', () => {
    const menu = component.find('Menu');
    const localeProp = menu.prop('defaultItem');
    expect(localeProp).toBe(undefined);
  });

  it('has the right list of locales', () => {
    const menu = component.find('Menu');
    const localesProp = menu.prop('items');
    const configLocales = config.supportedLngs.filter(
      (e: any) => e !== 'cimode'
    );
    expect(localesProp).toStrictEqual(configLocales);
  });

  it('changes of locale', () => {
    const menu = component.find('Menu');
    menu.simulate('select', 'MOCK_LOCALE');
    expect(i18n.language).toBe('MOCK_LOCALE');
  });

  it('changes not the locale', () => {
    const initLang = i18n.language;
    const menu = component.find('Menu');
    menu.simulate('select', i18n.language);
    expect(i18n.language).toBe(initLang);
  });
});
