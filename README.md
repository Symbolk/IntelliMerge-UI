# IntelliMerge-UI

#### The GUI client for developers to inspect resolved conflicts and manually resolve remained conflicts, after merging branches with IntelliMerge.

> Notice: Under intensive building🏗. 

### Screenshots

#### Light theme:
![light](/screenshots/light.png?raw=true "Light Theme")

#### Dark theme:
![dark](/screenshots/dark.png?raw=true "Dark Theme")

## As a User

### Requirements
- Windows (Linux/macOS will be supported really soon)
- Git ^2.18.0

### Setup

1. Download the binary software from the release page, for example, the exe file;

2. Config the software as the `mergetool` of Git, there are two ways to do it:
  - Config with commands in terminal:
  ```bash
  git config --global merge.tool intellimerge
  git config --global mergetool.prompt false
  git config --global mergetool.intellimerge.cmd '"[PATH]/IntelliMerge-UI.exe" "$LOCAL" "$REMOTE" "$BASE" -o "$MERGED"'
  git config --global mergetool.intellimerge.trustexitcode true
  ```
 - Config by appending the following content at the end of `~/.gitconfig`:
 ```json
  [merge]
    tool = intellimerge
    conflictstyle = diff3
  [mergetool "intellimerge"]
    path = [PATH]/IntelliMerge-UI.exe
    cmd =  [PATH]/IntelliMerge-UI.exe "$LOCAL" "$BASE" "$REMOTE" -o "$MERGED"
    trustExitCode = false
 ```
   > Replace the [PATH] with the full path of the downloade binary software.
3. Under a Git repo with merge conflicts, run the following command in terminal:
```bash
git mergetool
```

## As a Developer

### Requirements

- Windows/Linux/macOS
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
4. Write your code now!

### Lints and fixes files
```
yarn run lint
```
