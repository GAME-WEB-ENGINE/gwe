<img src="https://ra1jin.github.io/images/gwe_logo_borderless.png" alt="logo" width="400"/>

![Drag Racing](https://img.shields.io/badge/lang-javascript-f39f37) ![Drag Racing](https://img.shields.io/badge/npm-v1.0.1-blue) ![Drag Racing](https://img.shields.io/badge/release-v1.0.1-blue) ![Drag Racing](https://img.shields.io/badge/dependencies-electron-brightgreen) 

Copyright © 2020-2022 [Raijin].

Nombreux sont les **développeurs web** qui souhaite créer leurs propre **jeu vidéo**, c'est maintenant possible grâce à **GWE** alias **Game Web Engine**, un **moteur de jeu 2D/3D** basé sur les technologies du **web**.  
Pas besoin d'apprendre un nouveau langage, si vous maitrisez **HTML/JS/CSS** alors ce moteur est fait pour vous.

De plus, grâce à son projet de démarrage, ce moteur intègre tout le nécessaire pour commencer à développer un jeu vidéo avec un **minimum d'efforts**.

## Fonctionnalités générales
- Un gestionnaire graphique
- Un gestionaire des différents "écrans" du jeu
- Un gestionaire des ressources de texture
- Un gestionnaire des ressources de son
- Un gestionnaire des évènements
- Un gestionnaire des entrés clavier/souris
- Un gestionnaire de l'interface utilisateur à base de "widget" (plus de 16 widgets de bases)
- Un gestionnaire de script
- Support de plusieurs vues caméra 2D et 3D
- Support des meshs de navigation (JWM)
- Support des images statique (JSS)
- Support des images animées (JAS)
- Support des meshes texturés statique (JSM)
- Support des meshes texturés animé statique (JAM)
- Support des formes géométriques de debug

## Quelques parties pris concernant ce travail
- Utiliser le DOM pour les éléments UI
- Utiliser un format 3D dédié au moteur (voir exportateurs Blender)
- Utiliser un format 3D avec des animations frame par frame

## Installation
Tout d'abord, vérifier que Node.js est bien installé sur votre environnement.  
Si c'est le cas, installer cette librairie dans votre projet avec la commande suivante : ```npm install --save gwe```

## Commencer
Voici le minimum requis pour commencer à travailler avec gwe.  
Commencer par créer un projet avec l'arborescence suivante.
```
├── assets
    ├──
├── src
│   ├── app.js
│   ├── main_screen.js
├── index.html
├── main.js
```

### main.js (electron)
```js
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
 createWindow()
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600, // +26 for window frame
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.setMenuBarVisibility(false)
  win.loadFile('index.html');
  win.openDevTools();
}
```

### index.html
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <link rel="stylesheet" type="text/css" href="node_modules/gwe/core.css" />
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

### src/app.js
```js
window.addEventListener('load', async () => {
  let { GWE } = require('gwe');
  let app = new GWE.Application(800, 800, GWE.SizeModeEnum.FIXED);
  requestAnimationFrame(ts => app.run(ts));
});
```

### src/main_screen.js
```js
let { GWE } = require('gwe');

class MainScreen  extends  GWE.Screen {
  constructor(app) {
    super(app);
  }

  onEnter() {
    // votre code d'initialisation doit être ici.
  }

  onExit() {
    // votre code de destruction doit être ici.
  }
	
  update(ts) {
    // votre code logique de mise à jour.
  }

  draw(viewIndex) {
    // votre code de dessin.
  }
}

module.exports.MainScreen = MainScreen;
```

Ajouter et charger l'écran "MainScreen" afin que celui-ci soit exécuté via la ligne suivante ```GWE.screenManager.requestSetScreen(new  MainScreen(app));``` dans le fichier **app.js**.  

## Documentation
Une documentation complète est disponible ici: https://ra1jin.github.io/gwe-doc/.
Un exemple de démarrage est également disponible ici : https://github.com/ra1jin/gwe-boilerplate

## Templates
L'atout principal de GWE est son nombre conséquent de **projets de template**.
Une template est un **projet générique** basé sur un **genre spécifique** comme par ex: j-rpg, ccg, board, visual novel, etc...
L'intêret est de de partir d'une **base solide** et d'adapter la template afin de créer votre propre jeu vidéo.
Les templates sont payantes mais le **gain de temps** est énorme et le prix plus que raisonnable.

Voici la liste des templates actuellement disponibles:
- **gwe-template-thunar** - Module de scène (JRPG 3D Pré-calc)
- **gwe-template-odin** - Module de combat deux dimensions tour par tour + menu (JRPG).
- **gwe-template-sai** - Module jeu de carte à collectionner (CCG).
- **gwe-template-edgar** - Module visual novel (VN).
- **gwe-template-manua** - Module conçu pour les jeux de société en introduisant un modèle de programmation simplifié.

Template à venir:
- **gwe-template-bestla** - Module de combat trois dimensions tour par tour + menu (JRPG)
- **gwe-template-hades**- Module quake-like basique (FPS)

## Comment intégrer vos modèles 3D ?
L'extension Blender [blender-gwe-exporter](https://github.com/ra1jin/blender-gwe-exporter) vous permet d'exporter vos modèles statiques et animés dans les formats compatible GWE !
