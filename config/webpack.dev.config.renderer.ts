import Webpack from "webpack";
import Path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

import Paths from "./paths";

const { appSrc, appBuild, appNodeModules, appPublic, appHtml } = Paths;

const rendererRules: Webpack.Rule[] = [
  {
    test: /\.(ts|tsx)?$/,
    include: [appSrc, appNodeModules],
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", { targets: "maintained node versions" }]
          ]
        }
      },
      {
        loader: "eslint-loader"
      }
    ]
  },
  {
    test: /\.css$/i,
    include: [appNodeModules],
    use: ["style-loader", "css-loader"]
  },
  {
    test: /\.(woff|woff2|eot|ttf|svg)$/,
    loader: "file-loader",
    include: [appNodeModules],
    options: {
      name: "[name].[ext]",
      outputPath: "fonts/"
    }
  }
];

const rendererModules: Webpack.Module = {
  rules: rendererRules
};

const rendererResolve: Webpack.Resolve = {
  extensions: [".js", ".ts", ".tsx", ".json"]
};

const config: Webpack.Configuration = {
  mode: "development",
  target: "electron-renderer",
  entry: Path.join(Paths.appSrc, "index.tsx"),
  output: {
    filename: "renderer.js",
    path: appBuild
  },
  module: rendererModules,
  resolve: rendererResolve,
  plugins: [
    new HtmlWebpackPlugin({
      template: appHtml
    }),
    new CopyWebpackPlugin([
      { from: Path.join(appPublic, "icons"), to: "icons" }
    ])
  ]
};

export default config;
