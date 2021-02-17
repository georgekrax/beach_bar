var path = require("path");

module.exports = {
  images: {
    domains: ["images.unsplash.com", "source.unsplash.com"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    outputStyle: "compressed",
    precision: 3,
    prependData: '@use "main.scss" as *;',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));

    // ! Important: return the modified config
    return config;
  },
};
