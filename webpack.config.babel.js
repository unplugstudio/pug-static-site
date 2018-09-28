import BrowserSyncPlugin from 'browser-sync-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { resolve } from 'path'
import WebpackAssetsManifestPlugin from 'webpack-assets-manifest'

export default (env, argv) => {
  const isDev = argv.mode === 'development'
  const options = { sourceMap: isDev }

  const devPlugins = [
    new BrowserSyncPlugin({
      server: true,
      files: ['*.html'] // Also reload when HTML files change
    })
  ]
  const prodPlugins = [
    new WebpackAssetsManifestPlugin(),
    new OptimizeCssAssetsPlugin()
  ]
  const plugins = [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[chunkhash].css'
    })
  ].concat(isDev ? devPlugins : prodPlugins)

  return {
    entry: { theme: './js/index.js' },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[chunkhash].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!(fr-accordion|fr-offcanvas)\/).*/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.s?css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options },
            { loader: 'css-loader', options },
            { loader: 'postcss-loader', options },
            { loader: 'sass-loader', options }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$/,
          loader: 'file-loader'
        }
      ]
    },
    plugins,
    stats: {
      children: false,
      chunks: false,
      colors: true,
      hash: false,
      modules: false,
      version: false
    },
    devtool: isDev ? 'source-map' : false
  }
}
