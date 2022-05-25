let fs = require('fs');
let { GfxDrawable } = require('./gfx_drawable');
let { BoundingBox } = require('../bounding/bounding_box');
let { gfxManager } = require('./gfx_manager');
let { textureManager } = require('../texture/texture_manager');
let { eventManager } = require('../event/event_manager');

class JAM {
  constructor() {
    this.frames = [];
    this.textureCoords = [];
    this.animations = [];
  }
}

class JAMFrame {
  constructor() {
    this.vertices = [];
    this.normals = [];
  }
}

class JAMAnimation {
  constructor() {
    this.name = '';
    this.startFrame = 0;
    this.endFrame = 0;
    this.frameDuration = 0;
  }
}

/**
 * Classe représentant un modèle animé.
 */
class GfxJAM extends GfxDrawable {
  /**
   * Créer un modèle animé.
   */
  constructor() {
    super();
    this.jam = new JAM();
    this.texture = textureManager.getTexture('');
    this.boundingBox = new BoundingBox();
    this.currentAnimationName = '';
    this.isLooped = true;
    this.currentFrameIndex = 0;
    this.frameProgress = 0;
  }

  /**
   * Fonction de mise à jour.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
  update(ts) {
    let currentAnimation = this.jam.animations.find(animation => animation.name == this.currentAnimationName);
    if (!currentAnimation) {
      return;
    }

    let interpolateFactor = this.frameProgress / currentAnimation.frameDuration;
    let nextFrameIndex = 0;

    if (this.currentFrameIndex == currentAnimation.endFrame) {
      eventManager.emit(this, 'E_FINISHED');
      nextFrameIndex = this.isLooped ? currentAnimation.startFrame : currentAnimation.endFrame;
    }
    else {
      nextFrameIndex = this.currentFrameIndex + 1;
    }

    let currentFrame = this.jam.frames[this.currentFrameIndex];
    let nextFrame = this.jam.frames[nextFrameIndex];

    this.clearVertices();
    this.clearNormals();
    this.clearTextureCoords();

    for (let i = 0; i < currentFrame.vertices.length; i += 3) {
      let vax = currentFrame.vertices[i + 0];
      let vay = currentFrame.vertices[i + 1];
      let vaz = currentFrame.vertices[i + 2];
      let nax = currentFrame.normals[i + 0];
      let nay = currentFrame.normals[i + 1];
      let naz = currentFrame.normals[i + 2];
      let vbx = nextFrame.vertices[i + 0];
      let vby = nextFrame.vertices[i + 1];
      let vbz = nextFrame.vertices[i + 2];
      let nbx = nextFrame.normals[i + 0];
      let nby = nextFrame.normals[i + 1];
      let nbz = nextFrame.normals[i + 2];

      let vx = vax + ((vbx - vax) * interpolateFactor);
      let vy = vay + ((vby - vay) * interpolateFactor);
      let vz = vaz + ((vbz - vaz) * interpolateFactor);
      this.defineVertice(vx, vy, vz);

      let nx = nax + ((nbx - nax) * interpolateFactor);
      let ny = nay + ((nby - nay) * interpolateFactor);
      let nz = naz + ((nbz - naz) * interpolateFactor);
      this.defineNormal(nx, ny, nz);
    }

    for (let i = 0; i < this.jam.textureCoords.length; i += 2) {
      let tx = this.jam.textureCoords[i + 0];
      let ty = this.jam.textureCoords[i + 1];
      this.defineTextureCoord(tx, ty);
    }

    if (interpolateFactor >= 1) {
      this.currentFrameIndex = nextFrameIndex;
      this.frameProgress = 0;
    }
    else {
      this.frameProgress += ts;
    }
  }

  /**
   * Fonction de dessin.
   * @param {number} viewIndex - Index de la vue en cours.
   */
  draw(viewIndex) {
    let worldBoundingBox = this.boundingBox.transform(this.getModelMatrix());
    gfxManager.drawDebugBoundingBox(worldBoundingBox.min, worldBoundingBox.max, [1.0, 1.0, 0.0]);
    gfxManager.drawMesh(this.getModelMatrix(), this.vertexCount, this.vertices, this.normals, this.textureCoords, this.texture);
  }

  /**
   * Retourne la texture source.
   * @return {Texture} La texture source.
   */
  getTexture() {
    return this.texture;
  }

  /**
   * Définit la texture source.
   * @param {Texture} texture - La texture source.
   */
  setTexture(texture) {
    this.texture = texture;
  }

  /**
   * Retourne la boite englobante.
   * @return {BoudingBox} La boite englobante.
   */
  getBoundingBox() {
    return this.boundingBox;
  }

  /**
   * Retourne la boite englobante avec les transformations du modèle.
   * @return {BoundingBox} La boite englobante.
   */
  getWorldBoundingBox() {
    return this.boundingBox.transform(this.getModelMatrix());
  }

  /**
   * Retourne le nom de l'animation en cours.
   * @return {string} Le nom de l'animation.
   */
  getCurrentAnimationName() {
    return this.currentAnimationName;
  }

  /**
   * Charge un fichier "jam".
   */
  loadFromFile(path) {
    let json = JSON.parse(fs.readFileSync(path));
    if (!json.hasOwnProperty('Ident') || json['Ident'] != 'JAM') {
      throw new Error('GfxJAM::loadFromFile(): File not valid !');
    }

    this.jam = new JAM();

    for (let obj of json['Frames']) {
      let frame = new JAMFrame();
      frame.vertices = obj['Vertices'];
      frame.normals = obj['Normals'];
      this.jam.frames.push(frame);
    }

    this.jam.textureCoords = json['TextureCoords'];

    for (let obj of json['Animations']) {
      let animation = new JAMAnimation();
      animation.name = obj['Name'];
      animation.startFrame = parseInt(obj['StartFrame']);
      animation.endFrame = parseInt(obj['EndFrame']);
      animation.frameDuration = parseInt(obj['FrameDuration']);
      this.jam.animations.push(animation);
    }

    this.boundingBox = BoundingBox.createFromVertices(this.jam.frames[0].vertices);
    this.currentAnimationName = '';
    this.isLooped = true;
    this.currentFrameIndex = 0;
    this.frameProgress = 0;
  }

  /**
   * Lance une animation.
   * @param {string} animationName - Le nom de l'animation.
   * @param {boolean} isLooped - Si vrai, l'animation est en boucle.
   */
  play(animationName, isLooped) {
    let animation = this.jam.animations.find(animation => animation.name == animationName);
    if (!animation) {
      throw new Error('GfxJAM::play: animation not found !');
    }

    this.currentAnimationName = animationName;
    this.isLooped = isLooped;
    this.currentFrameIndex = animation.startFrame;
    this.frameProgress = 0;
  }
}

module.exports.GfxJAM = GfxJAM;