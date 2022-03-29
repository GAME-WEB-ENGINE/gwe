Fichier HTML
------------
```
<!DOCTYPE html>
<html lang="fr">

<head>
  <link rel="stylesheet" type="text/css" href="node_modules/gwe/core.css" />
  <link rel="stylesheet" type="text/css" href="assets/styles/gui.css" />
  <script rel="preload" type="text/javascript" src="src/app.js"></script>
</head>

<body style="position:relative">
  <div id="APP">
    <canvas id="CANVAS" width="1px" height="1px"></canvas>
    <div id="UI_ROOT"></div>
    <div id="UI_FADELAYER"></div>
    <div id="UI_OVERLAYER"></div>
  </div>
</body>

</html>
```

Fichier JS
----------
```
window.addEventListener('load', async () => {
  let { GWE } = require('./gwe');
  let { GameScreen } = require('./src/game_screen');

  let app = new GWE.Application(800, 800, GWE.SizeModeEnum.FIXED);
  GWE.screenManager.requestSetScreen(new GameScreen(app));
  requestAnimationFrame(ts => app.run(ts));
});
```