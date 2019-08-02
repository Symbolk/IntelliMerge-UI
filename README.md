# IntelliMerge-UI

#### The GUI client for developers to inspect resolved conflicts and manually resolve remained conflicts, after merging branches with IntelliMerge.

> Notice: Currently only for demo. Under building🏗. 

### Screenshots

#### Light theme:
![light](/screenshots/light.png?raw=true "Light Theme")

#### Dark theme:
![dark](/screenshots/dark.png?raw=true "Dark Theme")

### Requirements

- Windows
- Git ^2.18.0
- Node.js ^v10.16.0
- Yarn ~v1.16.0
- Vue-cli ~v3.8.4

### Setup

1. Run the following command under the root directory of the cloned repo to install dependencies:

```
yarn
```
2. Compiles and hot-reloads for development:

```
yarn run electron:serve
```

3. [OR] Build the executable for production:

```
yarn run electron:build
```

### Lints and fixes files
```
yarn run lint
```
