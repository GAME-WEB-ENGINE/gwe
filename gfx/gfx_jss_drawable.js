let { GfxDrawable } = require('./gfx_drawable');
let { BoundingBox } = require('../bounding/bounding_box');
let { Utils } = require('../helpers');
let { gfxManager } = require('./gfx_manager');
let { textureManager } = require('../texture/texture_manager');

/**
 * Classe représentant un sprite static.
 * @extends GfxDrawable
 */
class GfxJSSDrawable extends GfxDrawable {
  /**
   * Créer un sprite static.
   */
  constructor() {
    super();
    this.texturePosition = [0, 0];
    this.size = [0, 0];
    this.offset = [0, 0];
    this.texture = textureManager.getTexture('');
    this.boundingBox = new BoundingBox();
  }

  /**
   * Fonction de mise à jour.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
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

  /**
   * Fonction de dessin.
   * @param {number} viewIndex - Index de la vue en cours.
   */
  draw(viewIndex) {
    gfxManager.drawDebugBoundingBox(this.getModelMatrix(), this.boundingBox.min, this.boundingBox.max, [1.0, 1.0, 0.0]);
    gfxManager.drawMesh(this.getModelMatrix(), this.vertexCount, this.vertices, this.normals, this.textureCoords, this.texture);
  }

  /**
   * Retourne la matrice de modèle.
   * @return {array} Matrice de modèle.
   */
  getModelMatrix() {
    let matrix = super.getModelMatrix();
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(-this.offset[0], -this.offset[1], 0));
    return matrix;
  }

  /**
   * Retourne la position de l'uv.
   * @return {array} Position de l'uv (2 entrées).
   */
  getTexturePosition() {
    return this.texturePosition;
  }

  /**
   * Définit la position de l'uv.
   * @param {number} x - Position x.
   * @param {number} y - Position y.
   */
  setTexturePosition(x, y) {
    this.texturePosition = [x, y];
  }

  /**
   * Retourne la taille de l'uv.
   * @return {array} Taille de l'uv (2 entrées).
   */
  getSize() {
    return this.size;
  }

  /**
   * Définit la taille de l'uv.
   * @param {number} width - Largeur.
   * @param {number} height - Hauteur.
   */  
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

module.exports.GfxJSSDrawable = GfxJSSDrawable;