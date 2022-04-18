let { GfxDrawable } = require('./gfx_drawable');
let { BoundingRect } = require('../bounding/bounding_rect');
let { gfxManager } = require('./gfx_manager');

class GfxCollisionBox2D extends GfxDrawable {
  constructor() {
    super();
    this.boundingRect = new BoundingRect();
    this.properties = {};
  }

  draw() {
    let min = [this.boundingRect.min[0], 0, this.boundingRect.min[2]];
    let max = [this.boundingRect.max[0], 0, this.boundingRect.max[2]];
    gfxManager.drawDebugBoundingRect(this.getModelMatrix(), min, max, [0, 0, 1]);
  }

  setBoundingRect(boundingRect) {
    this.boundingRect = boundingRect;
  }

  getBoundingRect() {
    return this.boundingRect;
  }

  getWorldBoundingRect() {
    return this.boundingRect.transform(this.getModelMatrix());
  }

  setProperties(properties) {
    this.properties = properties;
  }

  setProperty(name, value) {
    this.properties[name] = value;
  }

  getProperty(name) {
    return this.properties[name];
  }
}

module.exports.GfxCollisionBox2D = GfxCollisionBox2D;