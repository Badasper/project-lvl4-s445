/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/',
  postcssConf: path.join(__dirname, '../configs/postcss.config.js'),
};

const env = process.env.NODE_ENV || 'development';

const devPlugins = (environment) => {
  if (environment === 'development') {
    return [new webpack.SourceMapDevToolPlugin({ filename: '[file].map' })];
  }
  return [];
};

const devConfig = (environment) => {
  if (environment === 'development') {
    return {
      devtool: 'cheap-module-eval-source-map',
      devServer: {
        contentBase: PATHS.dist,
        port: 8081,
        overlay: {
          warnings: true,
          errors: true,
        },
      },
    };
  }
  return {};
};

module.exports = {
  mode: env,
  ...devConfig(env),
  entry: {
    app: PATHS.src,
  },
  output: {
    filename: `${PATHS.assets}js/[name].bundle.[hash].js`,
    path: PATHS.dist,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /frontend*\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: PATHS.postcssConf } },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: PATHS.postcssConf } },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '~': PATHS.src,
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/index.pug`,
      filename: './index.html',
      inject: true,
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
      { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
      { from: `${PATHS.src}/static`, to: '' },
    ]),
    ...devPlugins(env),
  ],
};
