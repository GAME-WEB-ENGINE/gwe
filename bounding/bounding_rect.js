let { Utils } = require('../helpers');

/**
 * Classe représentant un rectangle englobante en deux-dimensions.
 */
class BoundingRect {
  /**
   * Créer un rectangle englobante.
   * @param {array} min - Point minimum (2 entrées).
   * @param {array} max - Point maximum (2 entrées).
   */
  constructor(min = [0, 0], max = [0, 0]) {
    this.min = min;
    this.max = max;
  }

  /**
   * Créer un rectangle englobante à partir d'un ensemble de points.
   * @param {array} vertices - Ensemble de points.
   * @return {BoundingRect} Le rectangle englobant.
   */
  static createFromVertices(vertices) {
    let min = vertices.slice(0, 2);
    let max = vertices.slice(0, 2);

    for (let i = 0; i < vertices.length; i += 3) {
      for (let j = 0; j < 2; j++) {
        let v = vertices[i + j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }

    return new BoundingRect(min, max);
  }

  /**
   * Retourne les coordonnées du centre.
   * @return {array} Coordonné du centre (3 entrées).
   */
  getCenter() {
    let w = this.max[0] - this.min[0];
    let h = this.max[1] - this.min[1];
    let x = this.min[0] + (w * 0.5);
    let y = this.min[1] + (h * 0.5);
    return [x, y];
  }

  /**
   * Retourne la taille.
   * @return {object} Avec "w" pour la largeur, "h" la hauteur.
   */
  getSize() {
    let w = this.max[0] - this.min[0];
    let h = this.max[1] - this.min[1];
    return { w, h };
  }

  /**
   * Retourne le rayon.
   * @return {number} La valeur du rayon.
   */
   getRadius() {
    return Utils.VEC2_DISTANCE(this.min, this.max) * 0.5;
  }

  /**
   * Retourne le périmètre.
   * @return {number} La valeur du périmètre.
   */
  getPerimeter() {
    let w = this.max[0] - this.min[0];
    let h = this.max[1] - this.min[1];
    return w + w + h + h;
  }

  /**
   * Retourne le volume.
   * @return {number} La valeur du volume.
   */
  getVolume() {
    return (this.max[0] - this.min[0]) * (this.max[1] - this.min[1]);
  }

  /**
   * Retourne une nouvelle rectangle englobante transformé.
   * @param {array} matrix - Matrice de transformation (16 entrées).
   * @return {BoundingRect} La nouvelle rectangle englobante.
   */
  transform(matrix) {
    let points = [];
    points.push([this.min[0], this.min[1]]);
    points.push([this.max[0], this.min[1]]);
    points.push([this.max[0], this.max[1]]);
    points.push([this.min[0], this.max[1]]);

    let transformedPoints = points.map((p) => {
      return Utils.MAT4_MULTIPLY_BY_VEC4(matrix, [p[0], p[1], 0, 1]);
    });

    let min = [transformedPoints[0][0], transformedPoints[0][1]];
    let max = [transformedPoints[0][0], transformedPoints[0][1]];

    for (let i = 0; i < transformedPoints.length; i++) {
      for (let j = 0; j < 2; j++) {
        let v = transformedPoints[i][j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }

    return new BoundingRect(min, max);
  }

  /**
   * Vérifie si un point est dans le rectangle englobant.
   * @param {number} x - Coordonnée x du point.
   * @param {number} y - Coordonnée y du point.
   * @return {boolean} Vrai si le point est dans le rectangle englobant.
   */
  isPointInside(x, y) {
    return (
      (x >= this.min[0] && x <= this.max[0]) &&
      (y >= this.min[1] && y <= this.max[1])
    );
  }

  /**
   * Vérifie si le rectangle englobant rentre en intersection avec une autre rectangle englobante.
   * @param {BoundingRect} aabr - Autre rectangle englobante.
   * @return {boolean} Vrai si il y a intersection.
   */
  intersectBoundingRect(aabr) {
    return (
      (this.min[0] <= aabr.max[0] && this.max[0] >= aabr.min[0]) &&
      (this.min[1] <= aabr.max[1] && this.max[1] >= aabr.min[1])
    );
  }
}

module.exports.BoundingRect = BoundingRect;