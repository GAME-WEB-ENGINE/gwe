let { GfxDrawable } = require('./gfx_drawable');
let { BoundingBox } = require('../bounding/bounding_box');
let { Utils } = require('../helpers');
let { gfxManager } = require('./gfx_manager');
let { textureManager } = require('../texture/texture_manager');

class GfxSpriteDrawable extends GfxDrawable {
  constructor() {
    super();
    this.texturePosition = [0, 0];
    this.size = [0, 0];
    this.offset = [0, 0];
    this.texture = textureManager.getTexture('');
    this.boundingBox = new BoundingBox();
  }

  update(ts) {
    this.clearVertices();
    this.clearNormals();
    this.clearTextureCoords();

    let minX = 0;
    let minY = 0;
    let maxX = this.size[0];
    let maxY = this.size[1];
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

    let ux = (this.texturePosition[0] / this.texture.width);
    let uy = (this.texturePosition[1] / this.texture.height);
    let vx = (this.texturePosition[0] + this.size[0]) / this.texture.width;
    let vy = (this.texturePosition[1] + this.size[1]) / this.texture.height;
    this.defineTextureCoord(ux, uy);
    this.defineTextureCoord(ux, vy);
    this.defineTextureCoord(vx, vy);
    this.defineTextureCoord(vx, vy);
    this.defineTextureCoord(vx, uy);
    this.defineTextureCoord(ux, uy);
  }

  draw() {
    gfxManager.drawDebugBoundingBox(this.getModelMatrix(), this.boundingBox.min, this.boundingBox.max, [1.0, 1.0, 0.0]);
    gfxManager.drawMesh(this.getModelMatrix(), this.vertexCount, this.vertices, this.normals, this.textureCoords, this.texture);
  }

  getModelMatrix() {
    let matrix = super.getModelMatrix();
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(-this.offset[0], -this.offset[1], 0));
    return matrix;
  }

  getTexturePosition() {
    return this.texturePosition;
  }

  setTexturePosition(x, y) {
    this.texturePosition = [x, y];
  }

  getSize() {
    return this.size;
  }

  setSize(width, height) {
    this.size = [width, height];
    this.boundingBox = new BoundingBox([0, 0], [width, height]);
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
}

module.exports.GfxSpriteDrawable = GfxSpriteDrawable;