import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSSR } from 'react-i18next';

import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import App from './App';
import { AppState } from './lib/store/app/types';

const mockStore = configureStore<{ app: AppState }>([]);
const store = mockStore({
  app: { locale: 'en' },
});
const initialI18nStore = {};
const initialLanguage = 'en';

const BaseApp = () => {
  useSSR(initialI18nStore, initialLanguage);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<BaseApp />);
    expect(wrapper.find(App)).toHaveLength(1);
  });

  it('should match its reference snapshot', () => {
    const wrapper = shallow(<BaseApp />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
