module.exports = {
  entry: './src/example.js',
  output: {
    filename: './example/example.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
