export default (env = 'production') => {
  process.env.NODE_ENV = /(development|production|test)/.test(env)
    ? env
    : 'production';
  return [
    require('./config.client').default,
    require('./config.server').default,
  ];
};
