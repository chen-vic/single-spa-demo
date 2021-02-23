module.exports = {
  // https://juejin.cn/post/6862661545592111111#heading-5
  // 告诉子应用在这个地址加载静态资源，否则会去基座应用的域名下加载
  publicPath: "http://localhost:3000/",
  configureWebpack: {
    // https://webpack.docschina.org/configuration/output/#outputlibrary
    output: {
      library: "singleVue", // 打包成一个类库
      // https://blog.csdn.net/weixin_40817115/article/details/81229337  CommonJS AMD CMD UMD
      libraryTarget: "umd", // umd最终会把bootstrap/mount/unmount挂载到window上
    },
    devServer: {
      port: 3000,
    },
  },
};