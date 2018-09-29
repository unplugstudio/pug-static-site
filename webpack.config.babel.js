import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { resolve } from 'path'
import glob from 'glob'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

/**
 * Create an instance of HtmlWebpackPlugin for each .pug file inside templates/
 * Excludes files starting with an underscore
 * @returns Array of HtmlWebpackPlugin instances
 */
function instantiateHtmlPlugins() {
  const templateNames = glob.sync('templates/**/[^_]*.pug')
  return templateNames.map(
    template =>
      new HtmlWebpackPlugin({
        filename: template.replace(/templates\/(.+)\.pug$/, '$1.html'),
        template
      })
  )
}

export default (env, argv) => {
  const isDev = argv.mode === 'development'
  const options = { sourceMap: isDev }

  const devPlugins = [new webpack.HotModuleReplacementPlugin()]
  const prodPlugins = [new OptimizeCssAssetsPlugin()]
  const plugins = [
    new ExtractCssChunks({
      filename: isDev ? '[name].css' : '[name].[chunkhash].css',
      hot: isDev
    }),
    ...instantiateHtmlPlugins()
  ].concat(isDev ? devPlugins : prodPlugins)

  return {
    entry: { theme: './js/index.js' },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[chunkhash].js'
    },
    devServer: {
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.s?css$/,
          use: [
            { loader: ExtractCssChunks.loader, options },
            { loader: 'css-loader', options },
            { loader: 'postcss-loader', options },
            { loader: 'sass-loader', options }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$/,
          loader: 'file-loader'
        },
        {
          test: /\.(pug|html)$/,
          loader: 'pug-loader'
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
