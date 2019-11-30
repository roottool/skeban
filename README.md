<p align="center">
  <img src="public/icons/icon.png" alt="Skeban logo" width="256" height="256"/>
</p>

# Skeban

**Ske**tches your brain in kan**ban**

Skeban is an open source Electron based kanban app. It is written in TypeScript and uses React.

## Screenshot

<p align="center">
  <img src="https://user-images.githubusercontent.com/11808736/69901340-981fe900-13c3-11ea-8b3d-86a2f7438cdd.png" alt="Skeban" />
</p>

## Development

```bash
git clone https://github.com/roottool/Skeban.git
yarn install
```

### Debug

```bash
yarn build:watch
yarn start
```

Or you can use the debug of Visual Stuido Code if you use Visual Studio Code.

1. Execute the bellow command

    ```bash
    yarn build:watch
    ```

2. Select `Skeban All` in the debug of Visual Stuido Code
3. Execute the debug

## Packaging

### Windows & Mac

```bash
yarn run pack
```

### Windows only

```bash
yarn run build
yarn run pack:win
```

### Mac only

```bash
yarn run build
yarn run pack:mac
```
