const path = require('path')

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.json$/,
          type: 'javascript/auto',
          include: [
            path.resolve(__dirname, 'static/data')
          ]
        }
      ]
    }
  }
}
