import Webpack from "webpack";
import Path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const rendererRules: Webpack.Rule[] = [
  {
    test: /\.tsx?$/,
    include: [
      Path.resolve(__dirname, 'src'),
      Path.resolve(__dirname, 'node_modules')
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

const src = Path.resolve(__dirname, "src");
const build = Path.resolve(__dirname, "build");

const config: Webpack.Configuration = {
  mode: "development",
  target: 'electron-renderer',
  entry: Path.join(src, 'index.tsx'),
  output: {
    filename: 'index.js',
    path: Path.resolve(build, "renderer"),
  },
  module: rendererModules,
  resolve: rendererResolve,
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: Path.join(build, 'index.html')
    }),
  ],
}

export default config;
