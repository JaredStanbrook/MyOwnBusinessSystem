const path = require("path");

module.exports = {
    mode: "none",
    entry: "./dist/javascripts/script.js",
    output: {
        filename: "./javascripts/built.js",
        path: path.resolve(__dirname, "dist"),
    },
};