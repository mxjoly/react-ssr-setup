// import React from 'react';
// import { Store } from 'redux';
// import thunk from 'redux-thunk';
// import { MemoryRouter, Router, Redirect, Route } from 'react-router';
// import { createMemoryHistory } from 'history';
// import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';
// import { render, shallow, ShallowWrapper, ShallowRendererProps } from 'enzyme';
// import { HelmetProvider, FilledContext } from 'react-helmet-async';
// import { I18nContext } from 'react-i18next';

// import App from '../../App';
// import { RootState } from '../store/rootReducer';
// import withLocale from './withLocale';

// const AppWithLocale = withLocale(App);

// const Providers = ({ children, store }) => {
//   return (
//     <Provider store={store}>
//       <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
//     </Provider>
//   );
// };

// describe('withLocale', () => {
//   let wrapper: ShallowWrapper;
//   let store: Store;

//   beforeEach(() => {
//     store = configureStore<RootState>([thunk])({ app: { locale: 'en' } });
//     wrapper = shallow(
//       <Providers store={store}>
//         <AppWithLocale />
//       </Providers>
//     );
//   });

//   it('renders without crashing', () => {
//     expect(wrapper).toHaveLength(1);
//   });

//   it('should match its reference snapshot', () => {
//     expect(wrapper.html()).toMatchSnapshot();
//   });

//   it('renders a localized component', () => {
//     expect(wrapper.find('LocalizedComponent')).toHaveLength(1);
//   });

//   it('should redirect', () => {});
// });
