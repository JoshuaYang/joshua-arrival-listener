const path = require('path');
const glob = require('glob');
const webpack = require('webpack');


const jsFiles = glob.sync('./dev/*.js');
const entry = {};
const eslintLoader = {
    loader: 'eslint-loader',
    options: {
        failOnWarning: true,
        failOnError: true,
    },
};

jsFiles.forEach((file, i) => {
    entry[path.basename(file, '.js')] = file;
});

module.exports = {
    entry,
    output: {
        path: path.join(process.cwd(), 'build'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'ArrivalListener',
    },
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                use: [
                    'babel-loader',
                    eslintLoader,
                ],
                exclude: /node_module/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules',
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: {
                    configFile: path.join(process.cwd(), '.eslintrc'),
                },
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                // drop_console: true,
            },
        }),
    ],
};
