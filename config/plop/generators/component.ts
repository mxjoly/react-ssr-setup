import paths from '../../paths';
import {
  getComponentTypes,
  isValidComponentName,
  isAvailableComponentName,
} from '../utils';

const prompts = [
  {
    name: 'componentType',
    type: 'list',
    choices: getComponentTypes(),
    message: 'What type of component do you want to create ?',
  },
  {
    name: 'componentName',
    type: 'input',
    message: 'Tap a name for your component :',
    filter: (input: string) => input[0].toUpperCase() + input.slice(1),
    validate: (input: string) =>
      !isValidComponentName(input)
        ? 'Invalid format'
        : isAvailableComponentName(input)
        ? true
        : "This component's name is already used",
  },
  {
    name: 'useTest',
    type: 'confirm',
    message: 'Create a test file ?',
    default: true,
  },
  {
    name: 'useStory',
    type: 'confirm',
    message: 'Add to Storybook ?',
    default: true,
  },
];

const actions = [
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/components/{{componentType}}/{{componentName}}/index.tsx`,
    templateFile: './templates/component/component.hbs',
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/components/{{componentType}}/{{componentName}}/index.test.tsx`,
    templateFile: './templates/component/component.test.hbs',
    skip: ({ useTest }) => (useTest ? false : 'Skip generating a test file'),
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/components/{{componentType}}/{{componentName}}/index.stories.tsx`,
    templateFile: './templates/component/component.stories.hbs',
    skip: ({ useStory }) => (useStory ? false : 'Skip generating a story file'),
  },
];

export default {
  description: 'Create a new component',
  prompts,
  actions,
};
