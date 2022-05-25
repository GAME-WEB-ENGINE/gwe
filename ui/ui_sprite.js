//
// @todo: Suivre le meme format que gfx_jss
//

let fs = require('fs');
let { eventManager } = require('../event/event_manager');
let { UIWidget } = require('./ui_widget');

class UISprite extends UIWidget {
  constructor(options = {}) {
    super({
      className: options.className || 'UISprite'
    });

    this.animations = [];
    this.currentAnimationName = '';
    this.currentAnimationFrameIndex = 0;
    this.isLooped = false;
    this.timeElapsed = 0;
  }

  update(ts) {
    let currentAnimation = this.animations.find(animation => animation.name == this.currentAnimationName);
    if (!currentAnimation) {
      return;
    }

    let currentFrame = currentAnimation.frames[this.currentAnimationFrameIndex];

    this.node.style.backgroundPositionX = -currentFrame.x + 'px';
    this.node.style.backgroundPositionY = -currentFrame.y + 'px';
    this.node.style.width = currentFrame.width + 'px';
    this.node.style.height = currentFrame.height + 'px';

    if (this.timeElapsed >= currentAnimation.frameDuration) {
      if (this.currentAnimationFrameIndex == currentAnimation.frames.length - 1) {
        eventManager.emit(this, 'E_SPRITE_COMPLETE');
        this.currentAnimationFrameIndex = this.isLooped ? 0 : currentAnimation.frames.length - 1;
        this.timeElapsed = 0;
      }
      else {
        eventManager.emit(this, 'E_SPRITE_NEW_FRAME', { frameIndex: this.currentAnimationFrameIndex + 1});
        this.currentAnimationFrameIndex = this.currentAnimationFrameIndex + 1;
        this.timeElapsed = 0;
      }   
    }
    else {
      this.timeElapsed += ts;
    }
  }

  play(animationName, isLooped = false) {
    let animation = this.animations.find(animation => animation.name == animationName);
    if (!animation) {
      throw new Error('UISprite::play: animation not found.');
    }

    this.currentAnimationName = animationName;
    this.currentAnimationFrameIndex = 0;
    this.isLooped = isLooped;
    this.timeElapsed = 0;
  }

  loadFromFile(path) {
    let json = JSON.parse(fs.readFileSync(path));
    if (!json.hasOwnProperty('ImageFile')) {
      throw new Error('UISprite::loadFromFile(): Missing "ImageFile" property');
    }

    this.animations = [];

    for (let obj of json['Animations']) {
      let animation = {};
      animation.name = obj['Name'];
      animation.frames = [];
      animation.frameDuration = parseInt(obj['FrameDuration']);

      for (let objFrame of obj['Frames']) {
        let frame = {};
        frame.x = objFrame['X'];
        frame.y = objFrame['Y'];
        frame.width = objFrame['Width'];
        frame.height = objFrame['Height'];
        animation.frames.push(frame);
      }

      this.animations.push(animation);
    }

    this.node.style.backgroundImage = 'url("' + json['ImageFile'] + '")';
    this.currentAnimationName = '';
    this.currentAnimationIndex = 0;
    this.timeElapsed = 0;
  }
}

module.exports.UISprite = UISprite;