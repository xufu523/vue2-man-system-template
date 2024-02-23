const webpack = require('webpack');

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          theme: {
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            name: 'chunk-theme',
            chunks: 'all',
            priority: 3,
            minChunks: 1,
            minSize: 0,
            reuseExistingChunk: true,
            enforce: true,
          },
          common: {
            test: /[\\/]node_modules[\\/]vue|vue-router|vuex|axios|js-cookie|moment|path-to-regexp|qs[\\/]/,
            name: 'chunk-common',
            chunks: 'all',
            priority: 2,
            minChunks: 1,
            minSize: 0,
            reuseExistingChunk: true,
            enforce: true,
          },
          echarts: {
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            name: 'chunk-echarts',
            chunks: 'all',
            priority: 2,
            minChunks: 1,
            minSize: 0,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
  },
  chainWebpack: config => {
    // 忽略/moment/locale下的所有文件
    config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  },
  devServer: {
    // proxy: {
    //   '/api': {
    //     target: 'http://yqsaas-api.test.chinawayltd.com',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/'
    //     },
    //   },
    // },
  },
};
