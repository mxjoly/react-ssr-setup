import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSSR } from 'react-i18next';

import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import App from '../App';

const mockStore = configureStore([]);
const store = mockStore({});
const initialI18nStore = {};
const initialLanguage = 'en';

const BaseApp = () => {
  useSSR(initialI18nStore, initialLanguage);
  return (
    <Suspense fallback={null}>
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    </Suspense>
  );
};

describe('<App />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<BaseApp />);
    expect(wrapper.find(App)).toHaveLength(1);
  });

  it('should matche its reference snapshot', () => {
    const tree = renderer.create(<BaseApp />).toJSON();
    expect(tree).toMatchInlineSnapshot();
  });
});
