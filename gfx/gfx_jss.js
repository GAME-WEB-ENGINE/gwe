let { GfxDrawable } = require('./gfx_drawable');
let { BoundingRect } = require('../bounding/bounding_rect');
let { Utils } = require('../helpers');
let { gfxManager } = require('./gfx_manager');
let { textureManager } = require('../texture/texture_manager');

/**
 * Classe représentant un sprite static.
 * @extends GfxDrawable
 */
class GfxJSS extends GfxDrawable {
  /**
   * Créer un sprite static.
   */
  constructor() {
    super();
    this.textureRect = [0, 0, 0, 0];
    this.offset = [0, 0];
    this.pixelsPerUnit = 100;
    this.texture = textureManager.getTexture('');
    this.boundingRect = new BoundingRect();
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
    let maxX = this.textureRect[2];
    let maxY = this.textureRect[3];
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

    let ux = (this.textureRect[0] / this.texture.width);
    let uy = (this.textureRect[1] / this.texture.height);
    let vx = (this.textureRect[0] + this.textureRect[2]) / this.texture.width;
    let vy = (this.textureRect[1] + this.textureRect[3]) / this.texture.height;
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
    gfxManager.drawDebugBoundingRect(this.getModelMatrix(), this.boundingRect.min, this.boundingRect.max, [1.0, 1.0, 0.0]);
    gfxManager.drawMesh(this.getModelMatrix(), this.vertexCount, this.vertices, this.normals, this.textureCoords, this.texture);
  }

  /**
   * Retourne la matrice de modèle.
   * @return {array} Matrice de modèle.
   */
  getModelMatrix() {
    let matrix = Utils.MAT4_IDENTITY();
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(this.position[0], this.position[1], this.position[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Y(this.rotation[1]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_X(this.rotation[0])); // y -> x -> z
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Z(this.rotation[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_SCALE(this.scale[0], this.scale[1], this.scale[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_SCALE(1 / this.pixelsPerUnit, 1 / this.pixelsPerUnit, 0));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(-this.offset[0], -this.offset[1], 0));
    return matrix;
  }

  /**
   * Retourne le rectangle de texture.
   * @return {array} Rectangle de texture (4 entrées).
   */
  getTextureRect() {
    return this.textureRect;
  }

  /**
   * Définit le rectangle de texture.
   * @param {number} left - Coordonnée gauche.
   * @param {number} top - Coordonnée haut.
   * @param {number} width - Largeur.
   * @param {number} height - Hauteur.
   */
  setTextureRect(left, top, width, height) {
    this.textureRect = [left, top, width, height];
    this.boundingRect = new BoundingRect([0, 0], [width, height]);
  }

  /**
   * Retourne le décallage du sprite par rapport à l'origine.
   * @return {array} Décallage du sprite (2 entrées).
   */
  getOffset() {
    return this.offset;
  }

  /**
   * Définit le décallage du sprite par rapport à l'origine.
   * @param {number} offsetX - Décallage en x.
   * @param {number} offsetY - Décallage en y.
   */
  setOffset(offsetX, offsetY) {
    this.offset = [offsetX, offsetY];
  }

  /**
   * Retourne la valeur de conversion px vers unité du monde.
   * @return {array} La valeur de conversion.
   */
  getPixelsPerUnit() {
    return this.pixelsPerUnit;
  }

  /**
   * Définit la valeur de conversion px vers unité du monde.
   * @param {number} pixelsPerUnit - La valeur de conversion.
   */
  setPixelsPerUnit(pixelsPerUnit) {
    this.pixelsPerUnit = pixelsPerUnit;
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
   * @return {BoundingRect} La boite englobante.
   */
  getBoundingRect() {
    return this.boundingRect;
  }

  /**
   * Retourne la boite englobante avec les transformations du modèle.
   * @return {BoundingRect} La boite englobante.
   */
  getWorldBoundingRect() {
    return this.boundingRect.transform(this.getModelMatrix());
  }
}

module.exports.GfxJSS = GfxJSS;