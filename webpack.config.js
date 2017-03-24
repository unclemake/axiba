var webpack = require('webpack');

module.exports = {
    //页面入口文件配置
    entry: {
        index: './src/index.js'
    },
    //入口文件输出配置
    output: {
        path: 'dist/',
        filename: '[name].js'
    }
};