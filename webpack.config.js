const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/setup.ts',
    experiments: {
        outputModule: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'setup.mjs',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'module',
        },
        clean: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'manifest.json', to: 'manifest.json' },
            ]
        })
    ],
    module: {
        generator: {
            'asset/resource': {
                publicPath: 'assets/itemOwnedIndicators/',
                outputPath: 'assets/itemOwnedIndicators/',
                filename: '[name][ext]',
            },
        },
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },
};