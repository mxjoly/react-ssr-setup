import { NodePlopAPI } from 'plop';
import { getPrettierConfig } from './utils';
import { componentGenerator, reducerGenerator } from './generators';

export default (plop: NodePlopAPI) => {
  plop.load('plop-prettier', getPrettierConfig(), false);
  plop.setWelcomeMessage('What do you want to generate ?');
  plop.setGenerator('React Component', componentGenerator);
  plop.setGenerator('Redux Reducer', reducerGenerator);
};
