# Tower Defense Classic

<img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Screenshots/new%20Main%20Menu.png?raw=true" width=50% height=50%>

Tower Defense Classic is an in browser game built with the Phaser library and Typescript. The goal of the game is to build towers and defend your end zone from approaching mobs as you cycle through a combat and build phase. A player loses lives when a mob reaches the end zone and eventually the player will lose if their lives reaches zero. If a player defeats all mobs in every wave, they are instead victorious! Unlike most modern Tower Defenses, which have a static path which the enemy mobs will follow. This version allows the Player to build mazes with their towers to route mobs. Which is how older Warcraft 3 and Starcraft 2 custom map Tower Defenses worked, hence the "classic" in the name".

# Features

## Towers and Mobs
Both a variety of mobs and towers in the game, with each having their own unique properties. Mobs having properties for animations, speed and hit points. Towers having properties for projectiles: speed, damage, firerate, travel time. All mobs and towers are based off an orignal mob or tower class and extended out from there.

### Mobs
<img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/mobs.gif?raw=true" alt="Mobs"/>

### Towers
<img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/towers.gif?raw=true" alt="Towers"/>


## Game State managed by MobX
All states in the game are managed by Mobx. Including: HP, Current, Lives, Timers, MobStore and TowerStore

<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/Game%20Stage.gif?raw=true" alt="Player State" />
  <img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/build%20Phase.gif?raw=true" alt="Timer"/>
</div>

## PathFinding
Using a breadth-first algorithm, Mobs are able to dynamically route themselves through any maze the player can build.

### Simple Path
<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/open_wave.gif?raw=true" width=250px alt="OpenWave" />
  <img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/open_wave_algo.gif?raw=true" width=250px alt="OpenWaveAlgo"/>
</div>

### More Complex Path
<img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/medium_wave.gif?raw=true" alt="MediumWave" width=600px/>
<img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/medium_wave_algo.gif?raw=true" alt="MediumWaveAlgo"/>

### Most Complex Path

<img src="https://github.com/ryguyroberts/TDC_ts/blob/main/docs/Gifs/complex_maze.gif?raw=true" alt="ComplexWave"/>

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Dependencies
- Phaser: 3.80.1
- MobX: 6.12.0

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |
| `npm run build` | Create a production build in the `dist` folder |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default. Please see the webpack documentation if you wish to change this, or add SSL support.

Once the server is running you can edit any of the files in the `src` folder. Webpack will automatically recompile your code and then reload the browser.

## Project Structure

- `index.html` - A basic HTML page to contain the game.
- `src` - Contains the game source code.
- `src/main.ts` - The main **entry** point. This contains the game configuration and starts the game.
- `src/global.d.ts` - Global TypeScript declarations, provide types information.
- `src/scenes/` - The Phaser Scenes are in this folder.
- `public/style.css` - Some simple CSS rules to help with page layout.
- `public/assets` - Contains the static assets used by the game.

## Handling Assets

Webpack supports loading assets via JavaScript module `import` statements.

This template provides support for both embedding assets and also loading them from a static folder. To embed an asset, you can import it at the top of the JavaScript file you are using it in:

```js
import logoImg from './assets/logo.png'
```

To load static files such as audio files, videos, etc place them into the `public/assets` folder. Then you can use this path in the Loader calls within Phaser:

```js
preload ()
{
    //  This is an example of an imported bundled image.
    //  Remember to import it at the top of this file
    this.load.image('logo', logoImg);

    //  This is an example of loading a static image
    //  from the public/assets folder:
    this.load.image('background', 'assets/bg.png');
}
```

When you issue the `npm run build` command, all static assets are automatically copied to the `dist/assets` folder.

## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy your game, you will need to upload *all* of the contents of the `dist` folder to a public facing web server.

## Customizing the Template

### Babel

You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

 ```
"browsers": [
  ">0.25%",
  "not ie 11",
  "not op_mini all"
]
 ```

### Webpack

If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can modify the `webpack/config.*.js` file for cross-project changes, or you can modify and/or create new configuration files and target them in specific npm tasks inside of `package.json`. Please see the [Webpack documentation](https://webpack.js.org/) for more information.

