const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  // Note: 
  // Chrome MV3 no longer allowed remote hosted code
  // Using module bundlers we can add the required code for your extension
  // Any modular script should be added as entry point
  entry: {
    popup: './src/popup/popup.js',
    createAccount: './src/popup/createAccount.js',
    main_script: './src/popup/main-script.js',
    options: './src/options/options.js',
    friends: './src/popup/friends.js',
    links: './src/popup/links.js',
    createLink: './src/popup/createLink.js',
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"] // This is script from entry point
    }),
    // Note: you can add as many new HtmlWebpackPlugin objects  
    // filename: being the html filename
    // chunks: being the script src
    // if the script src is modular then add it as the entry point above
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "createAccount.html"),
      filename: "createAccount.html",
      chunks: ["createAccount"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "createLink.html"),
      filename: "createLink.html",
      chunks: ["createLink"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options", "options.html"),
      filename: "options.html",
      chunks: ["options"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "main.html"),
      filename: "main.html",
      chunks: ["main_script"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "friends.html"), // <-- Add this
      filename: "friends.html",
      chunks: ["friends"] // <-- This ensures it gets linked to the JS file
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "links.html"), // <-- Add this
      filename: "links.html",
      chunks: ["links"] // <-- This ensures it gets linked to the JS file
    }),
    // Note: This is to copy any remaining files to bundler
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json' },
        { from: './src/background/background.js' },
        { from: './src/content/content.js' },
        { from: './src/icons/*' },
        { from: './src/css/*' },
        { from: './auth_config.json' }
      ],
    }),
  ],
  output: {
    // chrome load uppacked extension looks for files under dist/* folder
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
};