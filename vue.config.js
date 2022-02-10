const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    devServer: {
        writeToDisk: true,
    },
    configureWebpack: {
        module:{
            rules: [
                {
                    test:/\.(glb)(\?.*)?$/,
                    use: [
                        {
                        loader: 'file-loader',
                        }
                    ]
                }
            ]
        },
        amd: {
            // Enable webpack-friendly use of require in Cesium
            toUrlUndefined: true
        },
        resolve: {
            alias: {
                cesium: path.resolve(__dirname, 'node_modules/cesium/Source')
            },
            mainFiles: ['index', 'Cesium']
        },
        plugins: [
            // Copy Cesium Assets, Widgets, and Workers to a static directory
            new CopyWebpackPlugin([
                { from: path.resolve('node_modules/cesium/Build/Cesium/Workers'), to: 'Workers' },
                { from: path.resolve('node_modules/cesium/Source/Assets'), to: 'Assets' },
                { from: path.resolve('node_modules/cesium/Source/Widgets'), to: 'Widgets' }
            ]),
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('')
            })
        ],
    }
}
