import '../src/shared/App.scss';
import theme from './theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    theme,
    storySort: {
      method: 'alphabetical',
    },
  },
  layout: 'centered',
  docs: { previewSource: 'open' },
};
