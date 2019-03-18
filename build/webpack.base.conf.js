'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath
},
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000000000000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000000000000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
  // new CopyWebpackPlugin([
  //     {
  //       from: 'src/components/text-editor/tinymce'
  //     }],
  //     {
  //       ignore: [
  //         'text-editor.vue'
  //       ]
  //     }),
    new webpack.ProvidePlugin({
        'window.Quill': 'quill'
      })
  ],
  externals: { // 百度地图
    BMap: 'BMap',
    BMAP_ANIMATION_BOUNCE: 'BMAP_ANIMATION_BOUNCE',
    BMAP_ANCHOR_TOP_LEFT: 'BMAP_ANCHOR_TOP_LEFT',
    BMAP_ANCHOR_TOP_RIGHT: 'BMAP_ANCHOR_TOP_RIGHT',
    BMAP_NAVIGATION_CONTROL_LARGE: 'BMAP_NAVIGATION_CONTROL_LARGE',
    BMAP_NORMAL_MAP: 'BMAP_NORMAL_MAP',
    BMAP_HYBRID_MAP: 'BMAP_HYBRID_MAP'
  },
  // 上线前 剔除 指定依赖 打包
  // externals: {
  //   'vue': 'Vue',
  //   'vue-router': 'VueRouter',
  //   'axios': 'axios',
  //   'vuex': 'Vuex'
  // }
}
