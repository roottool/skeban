import Webpack from "webpack";
import Path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

import Paths from "./paths";

const {
  appSrc,
  appBuild,
  appNodeModules,
  appHtml
} = Paths;

const rendererRules: Webpack.Rule[] = [
  {
    test: /\.tsx?$/,
    include: [
      appSrc,
      appNodeModules
    ],
    loader: "babel-loader",
    options: {
      presets: [
        [
          '@babel/preset-env',
          { targets: 'maintained node versions' }
        ]
      ]
    }
  }
]

const rendererModules: Webpack.Module = {
  rules: rendererRules
}

const rendererResolve: Webpack.Resolve = {
  extensions: [
    ".js", ".ts", ".tsx", ".json"
  ]
}

const config: Webpack.Configuration = {
  mode: "development",
  target: 'electron-renderer',
  entry: Path.join(Paths.appSrc, 'index.tsx'),
  output: {
    filename: 'index.js',
    path: Path.resolve(appBuild, "renderer"),
  },
  module: rendererModules,
  resolve: rendererResolve,
  plugins: [
    new HtmlWebpackPlugin({
      template: appHtml,
      filename: Path.join(appBuild, 'index.html')
    }),
  ],
}

export default config;
