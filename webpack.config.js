const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    plugins: [
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public/img',
                    to: 'img'
                }
            ]
        })
    ],
    devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            include: [path.resolve(__dirname, 'src')],
            loader: 'babel-loader'
        }, {
            test: /.(sa|sc|c)ss$/,
            include: [path.resolve(__dirname, 'src')],
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }]
        }]
    },

    devServer: {
        open: true,
        host: 'localhost',
        port: 1234,
        hot: true,
        contentBase: path.resolve(__dirname, 'public')
    }
}
