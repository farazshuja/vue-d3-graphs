const API_BASE_URL = process.env.API_BASE_URL || 'http://foobar/'
const NODE_ENV = process.env.NODE_ENV || 'development'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const srcPath = path.resolve(__dirname, 'src')
const distPath = path.resolve(__dirname, 'dist')
const nodeModulesPath = path.resolve(__dirname, 'node_modules')
const serverPath = path.resolve(srcPath, 'server')

const plugins = []

if(NODE_ENV !== 'development')
  plugins.push(new CleanWebpackPlugin([distPath]))

plugins.push(
  new webpack.DefinePlugin({
    API_BASE_URL: JSON.stringify(API_BASE_URL),
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV)
    }
  }),

  new HtmlWebpackPlugin({
    template: './index.html'
  }),

  new CopyWebpackPlugin([{
    from: './assets/img/favicon.ico',
    to: 'assets/img/favicon.ico'
  }])
)

module.exports = {
  context: srcPath,
  entry: ['babel-polyfill', './index.js'],
  output: {
    path: distPath,
    filename: 'index.[chunkhash].js'
  },
  resolve: {
    modules: [srcPath, nodeModulesPath, '!' + serverPath],
    extensions: ['.js', '.json', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.(webm)$/,
        use: 'file-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
        exclude: nodeModulesPath
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: nodeModulesPath
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ]
      },
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }
    ]
  },
  plugins: plugins
}