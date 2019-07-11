import Webpack from "webpack";
import Path from "path";

const mainRules: Webpack.Rule[] = [
  {
    test: /\.ts$/,
    include: [
      Path.resolve(__dirname, 'src'),
    ],
    exclude: [
      Path.resolve(__dirname, 'node_modules'),
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
    ".ts"
  ]
}

const src = Path.resolve(__dirname, "src");
const build = Path.resolve(__dirname, "build");

const config: Webpack.Configuration = {
  mode: "development",
  target: 'electron-main',
  entry: Path.join(src, 'main.ts'),
  output: {
    filename: 'index.js',
    path: build
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: mainModules,
  resolve: mainResolve
}

export default config;
