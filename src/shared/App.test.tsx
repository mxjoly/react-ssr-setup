import React from 'react';
import { Middleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';
import configureStore from 'redux-mock-store';

import App from './App';
import { RootState } from './lib/store/rootReducer';

const middlewares: Middleware[] = [thunk];
const mockStore = configureStore<RootState>(middlewares)();

describe('<App />', () => {
  let wrapper: ShallowWrapper;

  beforeAll(() => {
    jest.mock('./lib/store/app/selectors', () => ({
      getLocale: () => 'en',
    }));

    // To test only the App component
    jest.mock('./lib/i18n/withLocale', () => (Component: React.FC) => {
      const hoc = (props: any) => <Component {...props} />;
      return hoc;
    });
  });

  beforeEach(() => {
    wrapper = shallow(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/']}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </MemoryRouter>
      </Provider>
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
