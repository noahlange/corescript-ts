const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    Community_Basic: './src/plugins/Community_Basic.ts',
    Corescript_Compat: './src/plugins/Corescript_Compat.ts',
    'tests.bundle': './src/tests/index.ts',
    'common.bundle': './src/lib/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: {
    corescript: 'corescript'
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new MinifyPlugin()
  ]
};
