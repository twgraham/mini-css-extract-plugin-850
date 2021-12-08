import type { Configuration, Module } from 'webpack'
import * as EsBuild from 'esbuild'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'

const config: Configuration = {
    entry: {
        app: path.resolve(__dirname, './src/index.tsx')
    },
    output: {
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    target: 'web',
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module: Module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)

                        if (packageName == null) {
                            console.error('Null package name, context may be incorrect', module)
                            return undefined
                        }

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `vendor.${packageName[1].replace('@', '')}`
                    }
                }
            }
        }
    },
    module: {
        rules: [
            // .ts, .tsx
            {
                test: /\.(j|t)sx?$/,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'tsx',
                            implementation: EsBuild
                        }
                    }
                ],
                include: path.resolve(__dirname, './'),
                exclude: /node_modules/
            },
            // css
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'icss'
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
}

export default config
