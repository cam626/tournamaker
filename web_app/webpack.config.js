const webpack = require('webpack');

const config = {
  entry: [
//    'script-loader!jquery/dist/jquery.min.js',
    './main/app.jsx'
  ],
  output: {
    path: __dirname,
    filename: './app.min.js'
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
  ],
  resolve: {
    alias: {
      
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|index\n.js)/,
        loader: 'babel-loader',
        resolve: {
          extensions: ['.js', '.jsx']
        }
      },
      { 
        test: /\.css$/, 
        loader: "style-loader!css-loader" 
      },
      { 
        test: /\.png$/, 
        loader: "url-loader?limit=100000" 
      },
      { 
        test: /\.jpg$/, 
        loader: "file-loader" 
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  devtool: 'inline-source-map'
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.optimization = { minimize: false };
  }
  if (argv.mode === 'production') {
    config.optimization = { minimize: false };
  }
  return config;
};
