import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  mode: 'production',
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
  },
};