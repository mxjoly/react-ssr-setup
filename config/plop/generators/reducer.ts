import paths from '../../paths';

const prompts = [
  {
    type: 'input',
    name: 'reducerName',
    message: 'Name of your reducer :',
    filter: (input: string) => {
      // Convert to camel case
      return input
        .replace(/^\w|[A-Z]|\b\w/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
    },
  },
];

const actions = [
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/lib/store/{{reducerName}}/actions.ts`,
    templateFile: './templates/reducer/actions.hbs',
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/lib/store/{{reducerName}}/actions.test.ts`,
    templateFile: './templates/reducer/actions.test.hbs',
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/lib/store/{{reducerName}}/reducer.ts`,
    templateFile: './templates/reducer/reducer.hbs',
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/lib/store/{{reducerName}}/reducer.test.ts`,
    templateFile: './templates/reducer/reducer.test.hbs',
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/lib/store/{{reducerName}}/selectors.ts`,
    templateFile: './templates/reducer/selectors.hbs',
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/lib/store/{{reducerName}}/selectors.test.ts`,
    templateFile: './templates/reducer/selectors.test.hbs',
  },
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/lib/store/{{reducerName}}/types.ts`,
    templateFile: './templates/reducer/types.hbs',
  },
];

export default {
  description: 'Generate a new reducer (reducer, actions, selectors)',
  prompts,
  actions,
};
