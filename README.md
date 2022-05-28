<img src="https://gamewebengine.com/images/home.png" alt="logo" width="423"/>

![Drag Racing](https://img.shields.io/badge/lang-javascript-f39f37) ![Drag Racing](https://img.shields.io/badge/npm-v1.0.1-blue) ![Drag Racing](https://img.shields.io/badge/release-v1.1.3-blue) ![Drag Racing](https://img.shields.io/badge/dependencies-electron-brightgreen) 

Copyright © 2020-2022 [Raijin].

Nombreux sont les **développeurs web** qui souhaitent créer leurs propres **jeux vidéo**, c'est maintenant possible grâce à **GWE** alias **Game Web Engine**, un **moteur de jeu 2D/3D** basé sur les technologies du **web**.  
Pas besoin d'apprendre un nouveau langage, si vous maîtrisez **HTML/JS/CSS** alors ce moteur est fait pour vous.

De plus, grâce à son projet de démarrage, ce moteur intègre tout le nécessaire pour commencer à développer un jeu vidéo avec un **minimum d'efforts**.

## Installation
Tout d'abord, vérifier que Node.js est bien installé sur votre environnement.  
Si c'est le cas, je vous invite à poursuivre sur le site officiel ici: https://gamewebengine.com/getting-started.    
Une documentation (non complète à ce jour) est également disponible ici: https://gamewebengine.com/documentation/Application.html.

## Projets
L'atout principal de GWE est son nombre conséquent de **projets de démarrage**.
Chaque projet est basé sur un **genre spécifique** comme par ex: j-rpg, ccg, board, visual novel, etc...
L'intêret est de partir d'une **base solide** et de l'adapter afin de créer votre propre jeu vidéo en un temps record.    

## Fonctionnalités générales
- Un gestionnaire graphique
- Un gestionnaire des différents "écrans" du jeu
- Un gestionnaire des ressources texture
- Un gestionnaire des ressources son
- Un gestionnaire des évènements
- Un gestionnaire des entrées clavier/souris
- Un gestionnaire de l'interface utilisateur à base de "widget" (plus de 16 widgets de bases)
- Un gestionnaire de script
- Support de plusieurs vues caméra 2D et 3D
- Support des meshs de navigation (JWM)
- Support des images statiques (JSS)
- Support des images animées (JAS)
- Support des meshs texturés statiques (JSM)
- Support des meshs texturés animés (JAM)
- Support des formes géométriques de debug

## Quelques partis pris concernant ce travail
- Utiliser le DOM pour les éléments UI
- Utiliser un format 3D dédié au moteur (voir exportateur Blender)
- Utiliser un format 3D avec des animations frame par frame

## Comment intégrer vos modèles 3D ?
L'extension Blender [blender-gwe-exporter](https://github.com/ra1jin/blender-gwe-exporter) vous permet d'exporter vos modèles statiques et animés dans les formats compatible GWE !

## Todos
- Transposer les éléments GFX 2D du plan xy vers le plan xz.
- Implémenter JAPS alias JSON Animated Polygon Sprite.
- Implémenter Billboard.
- Implémenter Skybox.
- Optimiser walkmesh.
