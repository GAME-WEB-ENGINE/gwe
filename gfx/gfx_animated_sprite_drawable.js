let fs = require('fs');
let { GfxDrawable } = require('./gfx_drawable');
let { BoundingBox } = require('../bounding/bounding_box');
let { Utils } = require('../helpers');
let { gfxManager } = require('./gfx_manager');
let { textureManager } = require('../texture/texture_manager');
let { eventManager } = require('../event/event_manager');

class Frame {
  constructor() {
    this.name = '';
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }
}

class Animation {
  constructor() {
    this.name = '';
    this.frames = [];
    this.frameDuration = 0;
  }
}

class GfxAnimatedSpriteDrawable extends GfxDrawable {
  constructor() {
    super();
    this.frames = [];    
    this.animations = [];
    this.size = [0, 0];
    this.offset = [0, 0];
    this.texture = textureManager.getTexture('');
    this.boundingBox = new BoundingBox();
    this.currentAnimationName = '';
    this.currentAnimationFrameIndex = 0;
    this.isLooped = false;
    this.frameProgress = 0;
  }

  update(ts) {
    let currentAnimation = this.animations.find(animation => animation.name == this.currentAnimationName);
    if (!currentAnimation) {
      return;
    }

    let currentFrame = this.frames.find(frame => frame.name == currentAnimation.frames[this.currentAnimationFrameIndex]);
    if (!currentFrame) {
      return;
    }

    this.clearVertices();
    this.clearNormals();
    this.clearTextureCoords();

    let minX = 0;
    let minY = 0;
    let maxX = currentFrame.width;
    let maxY = currentFrame.height;
    this.defineVertice(minX, maxY, 0);
    this.defineVertice(minX, minY, 0);
    this.defineVertice(maxX, minY, 0);
    this.defineVertice(maxX, minY, 0);
    this.defineVertice(maxX, maxY, 0);
    this.defineVertice(minX, maxY, 0);

    this.defineNormal(0, 0, 0);
    this.defineNormal(0, 0, 0);
    this.defineNormal(0, 0, 0);
    this.defineNormal(0, 0, 0);
    this.defineNormal(0, 0, 0);
    this.defineNormal(0, 0, 0);

    let ux = (currentFrame.x / this.texture.width);
    let uy = (currentFrame.y / this.texture.height);
    let vx = (currentFrame.x + currentFrame.width) / this.texture.width;
    let vy = (currentFrame.y + currentFrame.height) / this.texture.height;
    this.defineTextureCoord(ux, uy);
    this.defineTextureCoord(ux, vy);
    this.defineTextureCoord(vx, vy);
    this.defineTextureCoord(vx, vy);
    this.defineTextureCoord(vx, uy);
    this.defineTextureCoord(ux, uy);

    if (this.frameProgress >= currentAnimation.frameDuration) {
      if (this.currentAnimationFrameIndex == currentAnimation.frames.length - 1) {
        eventManager.emit(this, 'E_FINISHED');
        this.currentAnimationFrameIndex = this.isLooped ? 0 : currentAnimation.frames.length - 1;
        this.frameProgress = 0;
      }
      else {
        this.currentAnimationFrameIndex = this.currentAnimationFrameIndex + 1;
        this.frameProgress = 0;
      }
    }
    else {
      this.frameProgress += ts;
    }
  }

  draw() {
    gfxManager.drawDebugBoundingBox(this.getModelMatrix(), this.boundingBox.min, this.boundingBox.max, [1.0, 1.0, 0.0]);
    gfxManager.drawMesh(this.getModelMatrix(), this.vertexCount, this.vertices, this.normals, this.textureCoords, this.texture);
  }

  getModelMatrix() {
    let matrix = super.getModelMatrix();
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(this.offset[0], this.offset[1], 0));
    return matrix;
  }

  getOffset() {
    return this.offset;
  }

  setOffset(offsetX, offsetY) {
    this.offset = [offsetX, offsetY];
  }

  getTexture() {
    return this.texture;
  }

  setTexture(texture) {
    this.texture = texture;
  }

  getBoundingBox() {
    return this.boundingBox;
  }

  getWorldBoundingBox() {
    return this.boundingBox.transform(this.getModelMatrix());
  }

  loadFromFile(path) {
    let json = JSON.parse(fs.readFileSync(path));
    if (!json.hasOwnProperty('Ident') || json['Ident'] != 'GfxAnimatedSpriteDrawable') {
      throw new Error('GfxAnimatedSpriteDrawable::loadFromFile(): File not valid !');
    }

    this.frames = [];
    for (let obj of json['Frames']) {
      let frame = new Frame();
      frame.name = obj['Name'];
      frame.x = obj['X'];
      frame.y = obj['Y'];
      frame.width = obj['Width'];
      frame.height = obj['Height'];
      this.frames.push(frame);
    }

    this.animations = [];
    for (let obj of json['Animations']) {
      let animation = new Animation();
      animation.name = obj['Name'];
      animation.frames = obj['Frames'];
      animation.frameDuration = parseInt(obj['FrameDuration']);
      this.animations.push(animation);
    }

    this.currentAnimationName = '';
    this.currentAnimationIndex = 0;
    this.frameProgress = 0;
  }

  play(animationName, isLooped) {
    let animation = this.animations.find(animation => animation.name == animationName);
    if (!animation) {
      throw new Error('GfxAnimatedSpriteDrawable::play: animation not found.');
    }

    this.boundingBox = new BoundingBox([0, 0], [animation.frames[0].width, animation.frames[0].height]);
    this.currentAnimationName = animationName;
    this.currentAnimationFrameIndex = 0;
    this.isLooped = isLooped;
    this.frameProgress = 0;
  }
}

module.exports.GfxAnimatedSpriteDrawable = GfxAnimatedSpriteDrawable;