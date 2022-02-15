const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    target: 'node',
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
            "fs": false,
            "os": require.resolve("os-browserify/browser"),
            "path": require.resolve("path-browserify")
        }
    },
    node: {
        "fs": 'empty'
    };