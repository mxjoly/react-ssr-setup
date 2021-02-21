export default (env = 'production') => {
  if (/(development|production|test)/.test(env)) {
    process.env.NODE_ENV = env;
  } else {
    process.env.NODE_ENV = 'production';
  }
  return [
    require('./config.client').default,
    require('./config.server').default,
  ];
};
