import paths from '../../paths';

const prompts = [
  {
    type: 'input',
    name: 'reducerName',
    message: 'Name of your reducer :',
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
    path: `${paths.srcShared}/lib/store/{{reducerName}}/action.test.ts`,
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
