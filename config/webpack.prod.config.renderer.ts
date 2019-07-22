import Webpack from "webpack";
import Path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

import Paths from "./paths";

const { appSrc, appBuild, appNodeModules, appHtml } = Paths;

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
  mode: "production",
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
    })
  ]
};

export default config;
