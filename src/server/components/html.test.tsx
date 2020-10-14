import React from 'react';
import { HelmetData } from 'react-helmet-async';
import HtmlReactParser from 'html-react-parser';
import { shallow, ShallowWrapper } from 'enzyme';
import Html, { HtmlProps } from './Html';

// ================================================================ //

const mockHelmetData: HelmetData = {
  title: { toComponent: jest.fn() },
  base: { toComponent: jest.fn() },
  meta: { toComponent: jest.fn() },
  link: { toComponent: jest.fn() },
  script: { toComponent: jest.fn() },
  style: { toComponent: jest.fn() },
  noscript: { toComponent: jest.fn() },
  titleAttributes: { toComponent: jest.fn() },
  htmlAttributes: { toComponent: jest.fn() },
  bodyAttributes: { toComponent: jest.fn() },
};

// ================================================================ //

describe('Html server renderer', () => {
  let props: HtmlProps;
  let component: ShallowWrapper;
  let spyConsole: jest.SpyInstance;

  beforeAll(() => {
    spyConsole = jest.spyOn(console, 'warn').mockImplementation(() => null);
  });

  beforeEach(() => {
    props = {
      children: '<h1>Test</h1>',
      css: ['/static/bundle.css'],
      scripts: ['/static/bundle.js'],
      helmetContext: { helmet: mockHelmetData },
      state: '{}',
      initialI18nStore: '{}',
      initialLanguage: 'en',
    };
    component = shallow(<Html {...props} />);
  });

  afterAll(() => {
    spyConsole.mockRestore();
  });

  // ---------------------------------------------------- //

  it('renders without errors', () => {
    expect(component.length).toBe(1);
  });

  it('renders with the default paramaters', () => {
    props.css = undefined as any;
    props.scripts = undefined as any;
    props.state = undefined as any;
    props.initialI18nStore = undefined as any;
    component = shallow(<Html {...props} />);
    expect(component.length).toBe(1);
  });

  it('renders the app', () => {
    expect(component.find('#app').length).toBe(1);
  });

  it('includes the scripts props', () => {
    props.scripts.forEach((script) => {
      expect(
        component.html().includes(`<script src="${script}"></script>`)
      ).toBe(true);
    });
  });

  it('includes the css props', () => {
    props.css.forEach((css) => {
      expect(
        component.html().includes(`<link rel="stylesheet" href="${css}"/>`)
      ).toBe(true);
    });
  });

  it('initializes the __PRELOADED_STATE__', () => {
    expect(
      component.html().includes(`window.__PRELOADED_STATE__ = ${props.state};`)
    ).toBe(true);
  });

  it('initializes the i18nStore', () => {
    expect(
      component
        .html()
        .includes(`window.initialI18nStore = ${props.initialI18nStore};`)
    ).toBe(true);
  });

  it('initializes the language', () => {
    expect(
      component
        .html()
        .includes(`window.initialLanguage = '${props.initialLanguage}';`)
    ).toBe(true);
  });

  // ================================================================ //

  describe('Common website', () => {
    let component: ShallowWrapper;

    beforeAll(() => {
      process.env.PWA = 'false';
    });

    beforeEach(() => {
      props.favicon = '/static/assets/favicon.png';
      component = shallow(<Html {...props} />);
    });

    // ---------------------------------------------------- //

    it('matches its reference snapshot', () => {
      expect(component.html()).toMatchSnapshot();
    });

    it('includes the favicon', () => {
      expect(
        component.contains(
          <link rel="icon" type="image/png" href={props.favicon} />
        )
      ).toBe(true);
    });

    it('has the favicon with the correct extension', () => {
      const extensions = ['png', 'ico', 'svg', 'unknown'];
      extensions.forEach((ext) => {
        props.favicon = `/static/assets/favicon.${ext}`;
        component = shallow(<Html {...props} />);
        const type =
          ext === 'ico'
            ? 'image/x-icon'
            : ext === 'png'
            ? 'image/png'
            : ext === 'svg'
            ? 'image/svg+xml'
            : undefined;
        expect(
          component.contains(
            <link rel="icon" type={type} href={props.favicon} />
          )
        ).toBe(true);
      });
    });

    // ================================================================ //

    describe('Progressive web app', () => {
      let component: ShallowWrapper;

      beforeAll(() => {
        process.env.PWA = 'true';
      });

      beforeEach(() => {
        props.metadata =
          "<meta key='theme-color' name='theme-color' content='#ffffff' />";
        component = shallow(<Html {...props} />);
      });

      // ---------------------------------------------------- //

      it('matches its reference snapshot', () => {
        expect(component.html()).toMatchSnapshot();
      });

      it('includes the metada', () => {
        const metadata = HtmlReactParser(props.metadata as string);
        expect(component.contains(metadata)).toBe(true);
      });
    });
  });
});
