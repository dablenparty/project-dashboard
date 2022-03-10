const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    plugins: [new TsconfigPathsPlugin()]
    // alias: {
    //   '@components': path.resolve(__dirname, 'src/components'),
    //   '@context': path.resolve(__dirname, 'src/context'),
    //   '@models': path.resolve(__dirname, 'src/models'),
    // }
  },
};
