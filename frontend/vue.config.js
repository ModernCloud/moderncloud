const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Modern Cloud'
    }
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:8888',
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
}
