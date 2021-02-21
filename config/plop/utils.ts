import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import paths from '../paths';
import { PlopCfg } from 'plop';

type Parser =
  | 'babel'
  | 'babel-ts'
  | 'babel-flow'
  | 'json'
  | 'css'
  | 'scss'
  | 'markdown'
  | 'mdx'
  | 'html'
  | 'typescript';

/**
 * Get the base prettier configuration with a parser
 * @param parser - The parser used to format
 */
export const getPrettierConfig = (parser: Parser = 'babel-ts') => {
  const options = prettier.resolveConfig.sync(__dirname) as PlopCfg;
  Object.assign(options, { parser });
  return options;
};

/**
 * Get all the component types according to the directories in the component directory.
 */
export const getComponentTypes = () => {
  const source = path.join(paths.srcShared, '/components');
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

/**
 * Check if a string is a valid name for a react component
 * @param name - A string
 */
export const isValidComponentName = (name: string) => {
  return !/\s/.test(name) && name.match(/^(?!\d).[\dA-Za-z]+/);
};

/**
 * Check if a component name has not been used already
 * @param name - A string
 */
export const isAvailableComponentName = (name: string) => {
  const source = path.join(paths.srcShared, '/components');
  const allNamesUsed: string[] = [];

  fs.readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      fs.readdirSync(source + `/${dirent.name}`, {
        withFileTypes: true,
      })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => allNamesUsed.push(dirent.name));
    });

  return !allNamesUsed.includes(name);
};
