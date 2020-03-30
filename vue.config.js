module.exports = {
  publicPath: './',
  outputDir: 'zl',
  devServer: {
    port: 3300,
    open: true,
    // proxy:{
    //   "/api":{
    //     target: "http://d.biyaoema.com",
    //     changeOrigin: true,
    //     secure: false,
    //     pathRewrite:{'^/api':''},
    //   }
    // }
  },
}