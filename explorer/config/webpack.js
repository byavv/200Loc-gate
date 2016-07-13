switch (process.env.NODE_ENV) {
  case 'production':
    module.exports = require('./webpack.prod');
    break;
  case 'development':
  default:
    module.exports = require('./webpack.dev');
}
