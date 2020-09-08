/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Store, Middleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import ReactRouter from 'react-router';
import { shallow, mount, ReactWrapper } from 'enzyme';
import configureStore from 'redux-mock-store';

import withLocale from './withLocale';
import { RootState } from '../../lib/store/rootReducer';

const middlewares: Middleware[] = [thunk];

// ================================================================ //

jest.mock('../store/app/selectors', () => ({
  getLocale: () => 'fr',
}));

jest.mock('react-i18next', () => ({
  ...(jest.requireActual('react-i18next') as any),
  useTranslation: () => ({
    i18n: {
      t: jest.fn(),
      language: 'en',
    },
  }),
}));

jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as any),
  useHistory: () => ({
    replace: jest.fn(),
  }),
  Redirect: () => null,
}));

const locationSpy = jest.spyOn(ReactRouter, 'useLocation');
const useMockLocation = (location?: any) => {
  locationSpy.mockReturnValue({
    pathname: '/',
    search: '',
    state: '',
    hash: '',
    key: '',
    ...location,
  });
};

const MockApp = () => <div>Mock App</div>;
const WithLocaleMock = (props: any) => withLocale(MockApp)(props);

// ================================================================ //

describe('withLocale', () => {
  let wrapper: ReactWrapper;
  let store: Store;

  const mountWrapper = () => {
    wrapper = mount(
      shallow(
        <Provider store={store}>
          <WithLocaleMock />
        </Provider>
      ).get(0)
    );
  };

  beforeEach(() => {
    store = configureStore<RootState>(middlewares)();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ---------------------------------------------------- //

  it('renders without errors', () => {
    useMockLocation();
    mountWrapper();
    expect(wrapper.length).toBe(1);
  });

  it('returns the wrapped component if the pathname has a locale and a trainling slash', () => {
    useMockLocation({ pathname: '/en/' });
    mountWrapper();
    const redirect = wrapper.find('Redirect');
    expect(redirect.length).toBe(0);
    expect(wrapper.contains(MockApp())).toBe(true);
  });

  it('redirects to a pathname with the locale', () => {
    useMockLocation();
    mountWrapper();
    const redirect = wrapper.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.prop('to')).toBe('/en/');
  });

  it('adds a trailing slash to the pathname', () => {
    useMockLocation({ pathname: '/fr' });
    mountWrapper();
    const redirect = wrapper.find('Redirect');
    expect(redirect.prop('to')).toBe('/fr/');
  });

  it('replaces an invalid locale in the pathname', () => {
    useMockLocation({ pathname: '/invalid/locale/' });
    mountWrapper();
    const redirect = wrapper.find('Redirect');
    expect(redirect.prop('to')).toBe('/en/locale/');
  });

  it('replaces an invalid locale and add a trailing slash to the pathname', () => {
    useMockLocation({ pathname: '/invalid/locale' });
    mountWrapper();
    const redirect = wrapper.find('Redirect');
    expect(redirect.prop('to')).toBe('/en/locale/');
  });

  it('adds the search to the pathname', () => {
    useMockLocation({ pathname: '/en', search: '?msg=hello' });
    mountWrapper();
    const redirect = wrapper.find('Redirect');
    expect(redirect.prop('to')).toBe('/en/?msg=hello');
  });
});
