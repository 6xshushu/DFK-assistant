const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    
    styles: './src/js/public/styles.js',
    entrance: './src/js/content/entrance.js',
    
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader, // 替换 'style-loader'
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
            },
          },
        ],
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        exclude: /node_modules/,
        use: [
          {
            loader: 'json-loader',
            options: {
              name: '[name].[ext]',
              outputPath: (url, resourcePath, context) => {
                if (/manifest\.json$/.test(resourcePath)) {
                  return url;
                }
                return `json/${url}`;
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './manifest.json', // 源文件路径
          to: path.resolve(__dirname, 'dist') // 输出目录
        },
        {
          from: './src/img/128.png', // 源文件路径
          to: path.resolve(__dirname, 'dist/img') // 输出目录
        }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css' // 输出文件路径和名称
    })
  ]
};