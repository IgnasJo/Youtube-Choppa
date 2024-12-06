# Youtube Choppa
Chrome extension for video playback with hotkeys z, x, c, v, b in Youtube videos.
## Description
Chrome extension that mimics Youtube's uniform playback with 1, 2, 3, ... 9, keys using custom ones that can be set dynamically when the video plays. These playbacks are set as precisely as possible. All video with markers can be found in the extension popup.
## Use cases
- I use it to search for samples in music for music production
- It can also be used to set markers that you can comeback later to.

https://github.com/user-attachments/assets/681ea6b2-7167-4447-b370-a613d5a38d44

## Features
- Press a hotkey (z, x, c, v, b) to set or playback from the existing marker
- Press ctrl + hotkey (z, x, c, v, b) to delete the marker
- Hovering over the marker shows exact playback time
- The extension popup allows to see all video with these playbacks created

## Tech
- [Babel](https://babeljs.io/) with plug-ins:
  - `/preset-env` - polyfills
- [NPM](https://www.npmjs.com/)

## Installation
- Go to `chrome://extensions`
- Click `Load unpacked` and select the project folder

## Development
- Install dependencies
```shell
npm install
```
- Transpile `/src` to `/dist` with Babel
```shell
npm run build
```
- Transpile when a file changes
```shell
npm run watch
```

