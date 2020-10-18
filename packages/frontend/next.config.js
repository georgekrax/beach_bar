/* eslint-disable @typescript-eslint/no-var-requires */
const withLess = require("@zeit/next-less");
const withCss = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");
const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const path = require("path");

// Where your antd-custom.less file lives
const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, "./styles/antd-custom.less"), "utf8"));

module.exports = withSass({
  includePaths: [path.join(__dirname, "./styles/scss")],
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 3,
    localIdentName: "[local]___[hash:base64:5]",
  },
  ...withCss({
    ...withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables, // make your antd custom effective
        importLoaders: 0,
      },

      webpack: (config, { isServer }) => {
        //Make Ant styles work with less
        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/;
          const origExternals = [...config.externals];
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback();
              if (typeof origExternals[0] === "function") {
                origExternals[0](context, request, callback);
              } else {
                callback();
              }
            },
            ...(typeof origExternals[0] === "function" ? [] : origExternals),
          ];

          config.module.rules.unshift({
            test: antStyles,
            use: "null-loader",
          });
        }
        return config;
      },
    }),
  }),
});
