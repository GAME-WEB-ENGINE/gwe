let { Utils } = require('../helpers');

/**
 * Classe représentant un objet dessinable.
 */
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

  /**
   * Fonction de mise à jour.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
  update(ts) {
    // virtual method called during update phase !
  }

  /**
   * Fonction de dessin.
   * @param {number} viewIndex - Index de la vue en cours.
   */
  draw(viewIndex) {
    // virtual method called during draw phase !
  }

  /**
   * Retourne la position.
   * @return {array} La position (3 entrées).
   */
  getPosition() {
    return this.position;
  }

  /**
   * Définit la position.
   * @param {array} position - La position (3 entrées).
   */
  setPosition(position) {
    this.position = position;
  }

  /**
   * Ajoute à la position.
   * @param {number} x - La coordonnée x.
   * @param {number} y - La coordonnée y.
   * @param {number} z - La coordonnée z.
   */
  move(x, y, z) {
    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
  }

  /**
   * Retourne la rotation.
   * @return {array} La rotation (3 entrées).
   */
  getRotation() {
    return this.rotation;
  }

  /**
   * Définit la rotation.
   * @param {array} rotation - La rotation.
   */
  setRotation(rotation) {
    this.rotation = rotation;
  }

  /**
   * Ajoute à la rotation.
   * @param {number} x - La coordonnée x.
   * @param {number} y - La coordonnée y.
   * @param {number} z - La coordonnée z.
   */
  rotate(x, y, z) {
    this.rotation[0] += x;
    this.rotation[1] += y;
    this.rotation[2] += z;
  }

  /**
   * Retourne la mise à l'echelle.
   * @return {array} La mise à l'echelle (3 entrées).
   */
  getScale() {
    return this.scale;
  }

  /**
   * Définit la scale.
   * @param {array} scale - La mise à l'echelle.
   */
  setScale(scale) {
    this.scale = scale;
  }

  /**
   * Ajoute à la mise à l'echelle.
   * @param {number} x - La coordonnée x.
   * @param {number} y - La coordonnée y.
   * @param {number} z - La coordonnée z.
  */
  zoom(x, y, z) {
    this.scale[0] += x;
    this.scale[1] += y;
    this.scale[2] += z;
  }

  /**
   * Retourne le nombre de points.
   * @return {number} Le nombre de points.
   */
  getVertexCount() {
    return this.vertexCount;
  }

  /**
   * Retourne le tableau de points.
   * @return {array} Le tableau de points.
   */
  getVertices() {
    return this.vertices;
  }

  /**
   * Retourne le tableau de normales.
   * @return {array} Le tableau de normales.
   */
  getNormals() {
    return this.normals;
  }

  /**
   * Retourne le tableau de texture coords.
   * @return {array} Le tableau de texture coords.
   */
  getTextureCoords() {
    return this.textureCoords;
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
    return matrix;
  }

  /**
   * Ajoute un point.
   * @param {number} x - La coordonnée x.
   * @param {number} y - La coordonnée y.
   * @param {number} z - La coordonnée z.
  */
  defineVertice(x, y, z) {
    this.vertexCount++;
    this.vertices.push(x, y, z);
  }

  /**
   * Ajoute une normale.
   * @param {number} x - La coordonnée x.
   * @param {number} y - La coordonnée y.
   * @param {number} z - La coordonnée z.
  */
  defineNormal(x, y, z) {
    this.normals.push(x, y, z);
  }

  /**
   * Ajoute une uv.
   * @param {number} u - La coordonnée u.
   * @param {number} v - La coordonnée v.
  */
  defineTextureCoord(u, v) {
    this.textureCoords.push(u, v);
  }

  /**
   * Vide le tableau des points.
   */
  clearVertices() {
    this.vertices = [];
    this.vertexCount = 0;
  }

  /**
   * Vide le tableau des normales.
   */
  clearNormals() {
    this.normals = [];
  }

  /**
   * Vide le tableau des uvs.
   */
  clearTextureCoords() {
    this.textureCoords = [];
  }
}

module.exports.GfxDrawable = GfxDrawable;