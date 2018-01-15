const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/js');
const APP_DIR = path.resolve(__dirname, 'ES6');

const config = {
  entry: APP_DIR + '/initModule.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
            presets: ['env']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true}), // VERY IMPORTANT TO MINIMIZE bundle.js
    new webpack.DefinePlugin({ // VERY IMPORTANT TO MINIMIZE bundle.js
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
  ]
};

module.exports = config;
