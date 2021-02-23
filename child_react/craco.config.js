module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        output: {
          ...webpackConfig.output,
          publicPath: "http://localhost:4000/",
          library: "singleReact",
          libraryTarget: "umd",
        },
      };
    },
  },
  // devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {

  //   console.log(devServerConfig);
  //   // devServerConfig.publicPath = "/react";
  //   // devServerConfig.port = 4000;
  //   devServerConfig.historyApiFallback = true;
  //   devServerConfig.headers = {
  //     "Access-Control-Allow-Oirgin": "*",
  //   };

  //   return devServerConfig;
  // },
};
