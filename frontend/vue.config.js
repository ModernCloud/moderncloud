const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5
      }),
      new MonacoWebpackPlugin({
        languages: ['javascript', 'typescript']
      }),
      new FileManagerPlugin({
        events: {
          onEnd: {
            copy: [
              {source: 'assets/img/loading.gif', destination: '../dist/img/loading.gif'},
              {source: 'assets/img/favicon_16.png', destination: '../dist/img/favicon_16.png'},
              {source: 'assets/img/favicon_32.png', destination: '../dist/img/favicon_32.png'},
            ]
          }
        }
      })
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
