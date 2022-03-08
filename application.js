let { inputManager } = require('./input/input_manager');
let { screenManager } = require('./screen/screen_manager');
let { gfxManager } = require('./gfx/gfx_manager');
let { uiManager } = require('./ui/ui_manager');

let SizeModeEnum = {
  FIT: 0,
  ADJUST: 1,
  FIXED: 2
};

class Application {
  constructor(resolutionWidth, resolutionHeight, sizeMode = SizeModeEnum.FIT) {
    this.container = null;
    this.timeStep = 0;
    this.timeStamp = 0;
    this.resolutionWidth = resolutionWidth;
    this.resolutionHeight = resolutionHeight;
    this.sizeMode = sizeMode;
    this.plugins = [];

    this.container = document.getElementById('APP');
    if (!this.container) {
      throw new Error('Application::Application: APP element not found !');
    }

    this.container.style.width = this.resolutionWidth + 'px';
    this.container.style.height = this.resolutionHeight + 'px';

    if (this.sizeMode == SizeModeEnum.FIT) {
      this.container.style.transform = 'scale(' + window.innerWidth / resolutionWidth + ',' + window.innerHeight / resolutionHeight + ')';
    }
    else if (this.sizeMode == SizeModeEnum.ADJUST) {
      this.container.style.transform = 'scale(' + Math.min(window.innerWidth / resolutionWidth, window.innerHeight / resolutionHeight) + ')';
    }
    else if (this.sizeMode == SizeModeEnum.FIXED) {
      this.container.style.transform = 'none';
      this.container.style.margin = '0 auto';
    }
  }

  getTimeStep() {
    return this.timeStep;
  }

  getTimeStepAsSeconds() {
    return this.timeStep * 0.001;
  }

  getTimeStamp() {
    return this.timeStamp;
  }

  run(timeStamp) {
    this.timeStep = Math.min(timeStamp - this.timeStamp, 100);
    this.timeStamp = timeStamp;

    let event;
    while(event = inputManager.pullEvents()) {
      screenManager.handleEvent(event);
    }

    gfxManager.update(this.timeStep);
    uiManager.update(this.timeStep);
    screenManager.update(this.timeStep);

    for (let i = 0; i < gfxManager.getNumViews(); i++) {
      gfxManager.clear(i);
      screenManager.draw(i);
    }

    requestAnimationFrame((timeStamp) => { this.run(timeStamp); });
  }
}

module.exports.SizeModeEnum = SizeModeEnum;
module.exports.Application = Application;