# Youtube Choppa
Chrome extension for video playback with hotkeys z, x, c, v, b in Youtube videos.
## Motivation
I've seen producers on Instagram show how they play with Youtube's 1, 2, 3... buttons to start replaying videos from 10%, 20%, 30%... marks. This Chrome extension allows to assign a hotkey to the **<em>precise time</em>** of the playback. Then you can playback from that point when pressing the assigned hotkeys, essentially, mimicing the playback feature of a digital DJ controller. For producers, it's a great tool for picking out if the track is worth sampling because you can quickly test out how different audio sections play out.

## Features
- Press a hotkey (z, x, c, v, b) to set or playback from the existing marker
- Press ctrl + hotkey (z, x, c, v, b) to delete the marker
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



https://github.com/user-attachments/assets/681ea6b2-7167-4447-b370-a613d5a38d44

