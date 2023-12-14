module.exports = {
  runtimeCompiler: true,
  devServer: {
    proxy: {
      // 配置跨域
      '/': {
		target: 'http://localhost:3000/',
        ws: true,
        changOrigin: true
      },
	}
	}
}
