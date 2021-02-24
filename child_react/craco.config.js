const path = require('path');

// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration
module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, './src')
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output.publicPath = "http://localhost:4000/";
      webpackConfig.output.library = "singleReact";
      webpackConfig.output.libraryTarget = "umd";

      return webpackConfig;
    },
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.historyApiFallback = true;
    devServerConfig.headers = {
      "Access-Control-Allow-Oirgin": "*",
    };

    return devServerConfig;
  },
};
