import chalk from 'chalk';
import { Compiler } from 'webpack';

export const logMessage = (message: any, level = 'info') => {
  const color =
    level === 'error'
      ? 'red'
      : level === 'warning'
      ? 'yellow'
      : level === 'info'
      ? 'blue'
      : 'white';
  console.log(`[${new Date().toISOString()}]`, chalk[color](message));
};

export const compilerPromise = (
  name: string,
  compiler: Compiler
): Promise<void> => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      logMessage(`[${name}] Compiling`);
    });
    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};
