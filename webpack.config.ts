import Webpack from "webpack";
import Path from "path";

const rules: Webpack.Rule[] = [
    {
        test: /\.[ts|tsx]$/,
        use: [
            {
                loader: "ts-loader"
            }
        ]
    }
]

const modules: Webpack.Module = {
    rules: rules
}

const resolve: Webpack.Resolve = {
    extensions: [
        ".ts", ".tsx"
    ]
}

const src = Path.resolve(__dirname, "src");
const dist = Path.resolve(__dirname, "dist");

const config: Webpack.Configuration = {
    entry: `${src}/index.js`,
    output: {
        path: dist,
        filename: "bundle.js"
    },
    module: modules,
    resolve: resolve
}

export default config;
