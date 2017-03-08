module.exports = {
  entry: './src/audio-player.ts',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
        extensions: [".ts", ".tsx"],
        modules: ["../node_modules"]
    },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader'}
    ]
  }
}