module.exports = {
   entry: './client/react_components/main.js',
   output: {
      filename: "bundle.js",
      path: __dirname + '/client'
   },
   module: {
      noParse: ['ws'],
      loaders: [
         {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
   },
   externals: ['ws']
}
