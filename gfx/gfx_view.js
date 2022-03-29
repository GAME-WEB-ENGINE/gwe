let { GfxViewport } = require('./gfx_viewport');
let { Utils } = require('../helpers');

/**
 * Type de projection.
 */
let ProjectionModeEnum = {
  PERSPECTIVE: 0,
  ORTHOGRAPHIC: 1
};

/**
 * Classe représentant une vue/caméra.
 */
class GfxView {
  /**
   * Créer une vue.
   */
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
   * Retourne la matrice de camera.
   * @return {array} Matrice de camera.
   */
  getCameraMatrix() {
    let matrix = Utils.MAT4_IDENTITY();
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_TRANSLATE(this.position[0], this.position[1], this.position[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Y(this.rotation[1]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_X(this.rotation[0])); // y -> x -> z
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_ROTATE_Z(this.rotation[2]));
    matrix = Utils.MAT4_MULTIPLY(matrix, Utils.MAT4_SCALE(this.scale[0], this.scale[1], this.scale[2]));
    return matrix;
  }

  /**
   * Retourne la matrice de vue (inverse de la matrice caméra).
   * @return {array} Matrice de vue.
   */
  getCameraViewMatrix() {
    return Utils.MAT4_INVERT(this.getCameraMatrix());
  }

  /**
   * Retourne le viewport associé à la vue.
   * @return {GfxViewport} Le viewport.
   */
  getViewport() {
    return this.viewport;
  }

  /**
   * Définit le viewport associé à la vue.
   * @param {GfxViewport} viewport - Le viewport.
   */
  setViewport(viewport) {
    this.viewport = viewport;
  }

  /**
   * Retourne la couleur de fond.
   * @return {array} La couleur de fond (4 entrées).
   */
  getBackgroundColor() {
    return this.backgroundColor;
  }

  /**
   * Définit la couleur de fond.
   * @param {number} r - Canal rouge.
   * @param {number} g - Canal vert.
   * @param {number} b - Canal bleu.
   * @param {number} a - Canal alpha (transparence).
   */
  setBackgroundColor(r, g, b, a) {
    this.backgroundColor[0] = r;
    this.backgroundColor[1] = g;
    this.backgroundColor[2] = b;
    this.backgroundColor[3] = a;
  }

  /**
   * Retourne le mode de projection (2D/3D).
   * @return {ProjectionModeEnum} Le mode de projection.
   */
  getProjectionMode() {
    return this.projectionMode;
  }

  /**
   * Définit le mode de projection (2D/3D).
   * @param {ProjectionModeEnum} projectionMode - Le mode de projection.
   */
  setProjectionMode(projectionMode) {
    this.projectionMode = projectionMode;
  }

  /**
   * Retourne l'angle de vision en radian.
   * @return {number} L'angle de vision en radian.
   */
  getPerspectiveFovy() {
    return this.perspectiveFovy;
  }

  /**
   * Définit l'angle de vision en radian.
   * @param {number} perspectiveFovy - L'angle de vision en radian.
   */
  setPerspectiveFovy(perspectiveFovy) {
    this.perspectiveFovy = perspectiveFovy;
  }

  /**
   * Retourne la distance minimale de vision.
   * @return {number} La distance minimale de vision.
   */
  getPerspectiveNear() {
    return this.perspectiveNear;
  }

  /**
   * Définit la distance minimale de vision.
   * @param {number} perspectiveNear - La distance minimale de vision.
   */
  setPerspectiveNear(perspectiveNear) {
    this.perspectiveNear = perspectiveNear;
  }

  /**
   * Retourne la distance maximale de vision.
   * @return {number} La distance maximale de vision.
   */
  getPerspectiveFar() {
    return this.perspectiveFar;
  }

  /**
   * Définit la distance maximale de vision.
   * @param {number} perspectiveFar - La distance maximale de vision.
   */
  setPerspectiveFar(perspectiveFar) {
    this.perspectiveFar = perspectiveFar;
  }

  /**
   * Retourne la distance maximale de vision dans le mode orthographic.
   * @return {number} La distance maximale de vision.
   */
  getOrthographicDepth() {
    return this.orthographicDepth;
  }

  /**
   * Définit la distance maximale de vision dans le mode orthographic.
   * @param {number} orthographicDepth - La distance maximale de vision.
   */
  setOrthographicDepth(orthographicDepth) {
    this.orthographicDepth = orthographicDepth;
  }
}

module.exports.ProjectionModeEnum = ProjectionModeEnum;
module.exports.GfxView = GfxView;