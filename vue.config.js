module.exports = {
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  },
  css: {
    loaderOptions: {
      scss: {
        // 全局引入主题文件
        additionalData: '@import "@/style/theme.scss";'
      }
    }
  }
}