const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

module.exports = {
  mode: "development",
  // entry: ["webpack/hot/poll?1000", "./src/index.ts"],
  entry: "./src/index.ts",
  // watch: true,
  // externals: [nodeExternals({ allowlist: ["webpack/hot/poll?1000"] })],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        include: [path.resolve(__dirname, "./src")],
        use: {
          loader: "swc-loader",
          options: {
            sync: true,
            module: {
              type: "commonjs",
            },
            minify: true,
            jsc: {
              target: "es5",
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: true,
                dynamicImport: true,
              },
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
              },
              keepClassNames: true,
              loose: true,
              baseUrl: "./src",
              paths: {
                "@/entity/*": ["./entity/*"],
                "@/utils/*": ["./utils/*"],
                "@/constants/*": ["./constants/*"],
                "@/typings/*": ["./typings/*"],
                "@/config/*": ["./config/*"],
                "@/graphql/*": ["./graphql/*"],
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    // new StartServerPlugin("index.ts"),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.DefinePlugin({
    //   "process.env": { BUILD_TARGET: JSON.stringify("index") },
    // }),
  ],
  output: { path: path.join(__dirname, "dist"), filename: "index.js" },
};
