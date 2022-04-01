const path = require("path");

const webpack = require("webpack");

module.exports = {
  mode: "development",
  target: "node",
  resolve: {
    extensions: [".ts", ".js"],
  },
  stats: { warnings: false },
  // entry: "./src/index.ts",
  entry: {
    app: ["webpack-hot-middleware/client", "./src/index.ts"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: ["_http_common", "pg-native"],
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.m?ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: "swc-loader",
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify(""),
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};
