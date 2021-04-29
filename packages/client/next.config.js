var path = require("path");

module.exports = {
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "r-cf.bstatic.com",
      "user-account-images.s3.amazonaws.com",
      // The ones below do not work, because they are not protected with HTTPS and SSL,
      // due to the fact that the sub-domains are more than 1
      "beach-bar.user-profile-image.s3.amazonaws.com",
      "beach-bar.user-account-images.s3.amazonaws.com",
      "*.s3-eu-west-1.amazonaws.com",
      "hashtag--data.s3-eu-west-1.amazonaws.com",
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    outputStyle: "compressed",
    precision: 3,
    prependData: '@use "main.scss" as *;',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    // ! Important: return the modified config
    return config;
  },
};