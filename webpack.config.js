const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'client', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Steam Reviews',
      template: path.resolve(__dirname, 'public', 'template.html')
    }),
    new CompressionPlugin({
      test: /\.(css|js)$/,
      compressionOptions: {
        level: 6
      }
    })
  ],
  devServer: {
    proxy: {
      '/': 'http://localhost:3001'
    },
    contentBase: path.resolve(__dirname, 'public'),
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'client'),
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        include: [
          path.resolve(__dirname, 'client')
        ],
        loader: ['style-loader', 'css-loader']
      }
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
};
