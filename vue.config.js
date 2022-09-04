// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave:false,
// })
module.exports = {
  productionSourceMap:false,
  lintOnSave:false,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      fallback: { path: require.resolve("path-browserify") },
    },
  },
  //代理跨域
  devServer: {
    proxy: {
      '/api': {
        target:'http://gmall-h5-api.atguigu.cn',
        pathRewrite: {'^/api':''},
        ws:false,
      }
    }
  }
}
