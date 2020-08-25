import paths from '../../paths';

const prompts = [
  {
    type: 'input',
    name: 'pageTitle',
    message: 'Name of your page :',
  },
];

const actions = [
  {
    type: 'pretty-add',
    path: `${paths.srcShared}/pages/{{pageTitle}}/index.tsx`,
    templateFile: './templates/page/index.hbs',
  },
];

export default {
  description: 'Create a new page',
  prompts,
  actions,
};
