const webpack = require('webpack');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const titlePrefix = 'TC Notifier';

const pages = [
  {
    title: `${titlePrefix} About`,
    name: 'about',
    chunks: ['about'],
  },
];

const htmlDefaults = {
  template: './src/app/template.html',
};

module.exports = {
  devtool: 'source-map',
  target: 'electron-renderer',
  entry: {
    home: './src/app/Home.tsx',
    about: './src/app/About.tsx',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: resolve('./dist/app'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: resolve('./src/app/tsconfig.json'),
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: resolve('./node_modules/semantic-ui-css/semantic.min.css'),
        to: resolve('./dist/app/css/semantic.min.css'),
      },
      {
        from: resolve(
          './node_modules/semantic-ui-css/themes/default/assets/fonts',
        ),
        to: resolve('./dist/app/css/themes/default/assets/fonts'),
      },
    ]),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    // home page
    new HtmlWebpackPlugin({
      ...htmlDefaults,
      title: `${titlePrefix} Home`,
      name: 'home',
      filename: 'home.html',
      chunks: ['home'],
    }),
    // all other pages
    ...pages.map(
      p =>
        new HtmlWebpackPlugin({
          ...htmlDefaults,
          title: p.title,
          name: p.name,
          filename: `${p.name}.html`,
          chunks: p.chunks,
        }),
    ),
  ],
  watchOptions: {
    ignored: ['dist', 'node_modules'],
  },
};
