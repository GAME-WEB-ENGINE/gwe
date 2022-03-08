let { Utils } = require('../helpers');

class GfxDrawable {
  constructor() {
    this.position = [0.0, 0.0, 0.0];
    this.rotation = [0.0, 0.0, 0.0];
    this.scale = [1.0, 1.0, 1.0];
    this.vertices = [];
    this.normals = [];
    this.textureCoords = [];
    this.vertexCount = 0;
  }

  update() {
    // virtual method called during update phase !
  }

  draw() {
    // virtual method called during draw phase !
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

  getVertexCount() {
    return this.vertexCount;
  }

  getVertices() {
    return this.vertices;
  }

  getNormals() {
    return this.normals;
  }

  getTextureCoords() {
    return this.textureCoords;
  }

  getModelMatrix() {
    let matrix = Utils.MAT4_IDENTITY();
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(this.position[0], this.position[1], this.position[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Y(this.rotation[1]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_X(this.rotation[0])); // y -> x -> z
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Z(this.rotation[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_SCALE(this.scale[0], this.scale[1], this.scale[2]));
    return matrix;
  }

  defineVertice(x, y, z) {
    this.vertexCount++;
    this.vertices.push(x, y, z);
  }

  defineNormal(x, y, z) {
    this.normals.push(x, y, z);
  }

  defineTextureCoord(u, v) {
    this.textureCoords.push(u, v);
  }

  clearVertices() {
    this.vertices = [];
    this.vertexCount = 0;
  }

  clearNormals() {
    this.normals = [];
  }

  clearTextureCoords() {
    this.textureCoords = [];
  }
}

module.exports.GfxDrawable = GfxDrawable;