module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        poll: 1000,
        ignored: /node_modules/,
      };
      return webpackConfig;
    },
  },
};
