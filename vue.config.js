const { defineConfig } = require('@vue/cli-service')

module.exports = {
  // publicPath: '/'
  publicPath: process.env.NODE_ENV === 'production' ? '/actor-network/' : '/',

  chainWebpack: (config) => {
    // Treat web components as custom elements (avoid Vue warnings / component resolution).
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.compilerOptions = options.compilerOptions || {};
        const prev = options.compilerOptions.isCustomElement;
        options.compilerOptions.isCustomElement = (tag) => tag === 'vis-badge' || (typeof prev === 'function' && prev(tag));
        return options;
      });
  }
}
