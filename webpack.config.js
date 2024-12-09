const path =require('path');
module.exports = {
  entry: './main.js',
  output: {
    filename: 'hyperscript-html.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
