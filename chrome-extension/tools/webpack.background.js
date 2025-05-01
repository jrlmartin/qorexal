const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/background.ts'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'background.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, '../tsconfig.background.json')
        }
      }
    ]
  }
};