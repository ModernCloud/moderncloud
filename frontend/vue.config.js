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
              {source: 'src/assets/img/loading.gif', destination: 'dist/img/loading.gif'},
              {source: 'src/assets/img/favicon_16.png', destination: 'dist/img/favicon_16.png'},
              {source: 'src/assets/img/favicon_32.png', destination: 'dist/img/favicon_32.png'},
            ]
          }
        }
      })
    ],
    devtool: 'source-map',
    node: {
      "fs": "empty",
      "crypto": "empty",
      "tls": "empty",
      "net": "empty",
      "setImmediate": true
    },
    resolve: {
      alias: {
        'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
      }
    }
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
