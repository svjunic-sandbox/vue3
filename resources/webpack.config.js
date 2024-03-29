/* eslint-disable */

console.log(process.env.NODE_ENV);

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const DOCUMENT_ROOT = '../docs/js/';
const RESOURCES_ROOT = './src/';

module.exports = function () {
  const entries = {
    index: path.join(__dirname, `${RESOURCES_ROOT}index.ts`),
  };

  const watchOptions = {
    poll: true,
  };

  const output = {
    path: path.join(__dirname, DOCUMENT_ROOT),
    filename: '[name].js',
    chunkFilename: '[name].js',
    uniqueName: 'sandbox',
  };

  let optimization = {
    splitChunks: {
      name: 'vendor',
      //chunks: 'initial'
      chunks: 'all',
    },
  };

  if (process.env.NODE_ENV === 'production') {
    optimization = Object.assign(optimization, {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    });
  }

  const resolve = {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      //"velocity-animate": "velocity-animate/velocity.min.js"
    },

    // 拡張子の省略（Duno次第でだめかも）
    extensions: ['vue', 'tsx', '.ts', '.js', '.jsx'],

    // モジュール検索
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  };

  const baseConfig = {
    target: ['web', 'es5'],

    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
              },
            },
          ],
        },
      ],
    },

    plugins: [new VueLoaderPlugin(), new webpack.NoEmitOnErrorsPlugin(), new webpack.optimize.AggressiveMergingPlugin()],
  };

  return [
    Object.assign(
      {
        mode: 'production',
        watchOptions: watchOptions,
        entry: entries,
        resolve: resolve,
        output: output,
        optimization: optimization,
      },
      baseConfig
    ),
  ];
};
