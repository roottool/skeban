import Webpack from "webpack";
import Path from "path";

import Paths from "./paths";

const {
  appSrc,
  appBuild,
  appNodeModules
} = Paths;

const mainRules: Webpack.Rule[] = [
  {
    test: /\.ts$/,
    include: [
      appSrc,
    ],
    exclude: [
      appNodeModules,
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

const mainModules: Webpack.Module = {
  rules: mainRules
}

const mainResolve: Webpack.Resolve = {
  extensions: [
    ".js", ".ts"
  ]
}

const config: Webpack.Configuration = {
  mode: "development",
  target: 'electron-main',
  entry: Path.join(appSrc, 'main.ts'),
  output: {
    filename: 'index.js',
    path: appBuild
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: mainModules,
  resolve: mainResolve
}

export default config;
