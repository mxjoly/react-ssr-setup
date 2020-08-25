import { NodePlopAPI } from 'plop';
import { getPrettierConfig } from './utils';
import {
  pageGenerator,
  componentGenerator,
  reducerGenerator,
} from './generators';

export default (plop: NodePlopAPI) => {
  plop.load('plop-prettier', getPrettierConfig(), false);
  plop.setWelcomeMessage('What do you want to generate ?');
  plop.setGenerator('Site Page', pageGenerator);
  plop.setGenerator('React Component', componentGenerator);
  plop.setGenerator('Redux Reducer', reducerGenerator);
};
