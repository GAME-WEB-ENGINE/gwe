let { GfxDrawable } = require('./gfx_drawable');
let { BoundingBox } = require('../bounding/bounding_box');
let { gfxManager } = require('./gfx_manager');

class GfxCollisionBox3D extends GfxDrawable {
  constructor() {
    super();
    this.boundingBox = new BoundingBox();
    this.properties = {};
  }

  draw() {
    gfxManager.drawDebugBoundingBox(this.getModelMatrix(), this.boundingBox.min, this.boundingBox.max, [0, 0, 1]);
  }

  setBoundingBox(aabb) {
    this.boundingBox = aabb;
  }

  getBoundingBox() {
    return this.boundingBox;
  }

  getWorldBoundingBox() {
    return this.boundingBox.transform(this.getModelMatrix());
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

module.exports.GfxCollisionBox3D = GfxCollisionBox3D;