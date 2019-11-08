module.exports = {
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://localhost:9999',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true
      }
    }
  }
}
