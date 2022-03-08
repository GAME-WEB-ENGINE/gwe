let { GfxViewport } = require('./gfx_viewport');
let { Utils } = require('../helpers');

let ProjectionModeEnum = {
  PERSPECTIVE: 0,
  ORTHOGRAPHIC: 1
};

class GfxView {
  constructor() {
    this.position = [0.0, 0.0, 0.0];
    this.rotation = [0.0, 0.0, 0.0];
    this.scale = [1.0, 1.0, 1.0];
    this.viewport = new GfxViewport();
    this.backgroundColor = [0.0, 0.0, 0.0, 1.0];    
    this.projectionMode = ProjectionModeEnum.PERSPECTIVE;
    this.perspectiveFovy = Math.PI / 4;
    this.perspectiveNear = 2;
    this.perspectiveFar = 2000;
    this.orthographicDepth = 700;
  }

  getPosition() {
    return this.position;
  }

  setPosition(position) {
    this.position = position;
  }

  move(x, y, z) {
    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
  }

  getRotation() {
    return this.rotation;
  }

  setRotation(rotation) {
    this.rotation = rotation;
  }

  rotate(x, y, z) {
    this.rotation[0] += x;
    this.rotation[1] += y;
    this.rotation[2] += z;
  }

  getScale() {
    return this.scale;
  }

  setScale(scale) {
    this.scale = scale;
  }

  zoom(x, y, z) {
    this.scale[0] += x;
    this.scale[1] += y;
    this.scale[2] += z;
  }

  getCameraMatrix() {
    let matrix = Utils.MAT4_IDENTITY();
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(this.position[0], this.position[1], this.position[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Y(this.rotation[1]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_X(this.rotation[0])); // y -> x -> z
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Z(this.rotation[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_SCALE(this.scale[0], this.scale[1], this.scale[2]));
    return matrix;
  }

  getCameraViewMatrix() {
    return Utils.MAT4_INVERT(this.getCameraMatrix());
  }

  getViewport() {
    return this.viewport;
  }

  setViewport(viewport) {
    this.viewport = viewport;
  }

  getBackgroundColor() {
    return this.backgroundColor;
  }

  setBackgroundColor(r, g, b, a) {
    this.backgroundColor[0] = r;
    this.backgroundColor[1] = g;
    this.backgroundColor[2] = b;
    this.backgroundColor[3] = a;
  }

  getProjectionMode() {
    return this.projectionMode;
  }

  setProjectionMode(projectionMode) {
    this.projectionMode = projectionMode;
  }

  getPerspectiveFovy() {
    return this.perspectiveFovy;
  }

  setPerspectiveFovy(perspectiveFovy) {
    this.perspectiveFovy = perspectiveFovy;
  }

  getPerspectiveNear() {
    return this.perspectiveNear;
  }

  setPerspectiveNear(perspectiveNear) {
    this.perspectiveNear = perspectiveNear;
  }

  getPerspectiveFar() {
    return this.perspectiveFar;
  }

  setPerspectiveFar(perspectiveFar) {
    this.perspectiveFar = perspectiveFar;
  }

  getOrthographicDepth() {
    return this.orthographicDepth;
  }

  setOrthographicDepth(orthographicDepth) {
    this.orthographicDepth = orthographicDepth;
  }
}

module.exports.ProjectionModeEnum = ProjectionModeEnum;
module.exports.GfxView = GfxView;