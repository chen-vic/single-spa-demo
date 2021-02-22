module.exports = {
  configureWebpack: {
    // https://webpack.docschina.org/configuration/output/#outputlibrary
    output: {
      library: 'singleVue', // 打包成一个类库
      libraryTarget: 'umd' // umd最终会把bootstrap/mount/unmount挂载到window上
    },
    devServer: {
      port: 3000
    }
  }
}