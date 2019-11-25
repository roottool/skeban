module.exports = {
  "env": {
    "browser": true
  },
  "extends": [
    "airbnb",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "@typescript-eslint",
    "react-hooks"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module"
  },
  "settings": {
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx"
    ],
    "import/core-modules": [
      "app"
    ],
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    }
  },
  "rules": {
    "react/prop-types": [
      0
    ],
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-filename-extension": [
      "error",
      {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    ],
    "import/extensions": [
      "error", "always",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "import/no-extraneous-dependencies": [
      "error", {
        devDependencies: [
          "config/**/*.ts",
          "src/main.ts",
          "src/**/*.stories.tsx"
        ],
        peerDependencies: false
      }
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "react/jsx-props-no-spreading": 0
  }
}
