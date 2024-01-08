const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "web",
  entry: {
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  devServer: {
    hot: true,
    liveReload: true,
    port: 8080,
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "popup.html",
      chunks: ["popup"],
      template: path.join(__dirname, "src", "html", "popup.html"),
    }),
    new HtmlWebpackPlugin({
      filename: "options.html",
      chunks: ["options"],
      template: path.join(__dirname, "src", "html", "options.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "manifest.json"),
          to: path.join(__dirname, "dist"),
        },
        {
          from: path.join(__dirname, "src", "images", "icon128.png"),
          to: path.join(__dirname, "dist"),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        loader: "file-loader",
        options: {
          name: "/dist/[name].[ext]",
          esModule: false,
        },
      },
    ],
  },
};
