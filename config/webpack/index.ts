export default (env = 'production') => {
  if (env.match(/(development|production|test)/)) {
    process.env.NODE_ENV = env;
  } else {
    process.env.NODE_ENV = 'production';
  }
  return [
    require('./config.client').default,
    require('./config.server').default,
  ];
};
