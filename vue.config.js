const path = require('path');

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/styles/_variables.scss')],
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      // eslint-disable-next-line
      args[0].title = 'InTry 4.0';
      return args;
    });
  },
};
