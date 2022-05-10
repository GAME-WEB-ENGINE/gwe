let { Utils } = require('../helpers');

/**
 * Classe représentant une boite englobante en trois-dimensions.
 */
class BoundingBox {
  /**
   * Créer une boite englobante.
   * @param {array} min - Point minimum (3 entrées).
   * @param {array} max - Point maximum (3 entrées).
   */
  constructor(min = [0, 0, 0], max = [0, 0, 0]) {
    this.min = min;
    this.max = max;
  }

  /**
   * Créer une boite englobante à partir d'un ensemble de points.
   * @param {array} vertices - Ensemble de points.
   * @return {BoundingBox} La boite englobante.
   */
  static createFromVertices(vertices) {
    let min = vertices.slice(0, 3);
    let max = vertices.slice(0, 3);
    for (let i = 0; i < vertices.length; i += 3) {
      for (let j = 0; j < 3; j++) {
        let v = vertices[i + j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }

    return new BoundingBox(min, max);
  }

  /**
   * Retourne les coordonnées du centre.
   * @return {array} Coordonné du centre (3 entrées).
   */
  getCenter() {
    let w = this.max[0] - this.min[0];
    let h = this.max[1] - this.min[1];
    let d = this.max[2] - this.min[2];
    let x = this.min[0] + (w * 0.5);
    let y = this.min[1] + (h * 0.5);
    let z = this.min[2] + (d * 0.5);
    return [x, y, z];
  }

  /**
   * Retourne la taille.
   * @return {object} Avec "w" pour la largeur, "h" la hauteur et "d" la profondeur.
   */
  getSize() {
    let w = this.max[0] - this.min[0];
    let h = this.max[1] - this.min[1];
    let d = this.max[2] - this.min[2];
    return { w, h, d };
  }

  /**
   * Retourne le rayon.
   * @return {number} La valeur du rayon.
   */
  getRadius() {
    return Utils.VEC3_DISTANCE(this.min, this.max) * 0.5;
  }

  /**
   * Retourne le périmètre.
   * @return {number} La valeur du périmètre.
   */
  getPerimeter() {
    let w = this.max[0] - this.min[0];
    let d = this.max[2] - this.min[2];
    return w + w + d + d;
  }

  /**
   * Retourne le volume.
   * @return {number} La valeur du volume.
   */
  getVolume() {
    return (this.max[0] - this.min[0]) * (this.max[1] - this.min[1]) * (this.max[2] - this.min[2]);
  }

  /**
   * Retourne une nouvelle boite englobante transformé.
   * @param {array} matrix - Matrice de transformation (16 entrées).
   * @return {BoundingBox} La nouvelle boite englobante.
   */
  transform(matrix) {
    let points = [];
    points.push([this.min[0], this.min[1], this.min[2]]);
    points.push([this.max[0], this.min[1], this.min[2]]);
    points.push([this.max[0], this.max[1], this.min[2]]);
    points.push([this.min[0], this.max[1], this.min[2]]);
    points.push([this.min[0], this.max[1], this.max[2]]);
    points.push([this.max[0], this.max[1], this.max[2]]);
    points.push([this.max[0], this.min[1], this.max[2]]);
    points.push([this.min[0], this.min[1], this.max[2]]);

    let transformedPoints = points.map((p) => {
      return Utils.MAT4_MULTIPLY_BY_VEC4(matrix, [p[0], p[1], p[2], 1]);
    });

    let min = [transformedPoints[0][0], transformedPoints[0][1], transformedPoints[0][2]];
    let max = [transformedPoints[0][0], transformedPoints[0][1], transformedPoints[0][2]];

    for (let i = 0; i < transformedPoints.length; i++) {
      for (let j = 0; j < 3; j++) {
        let v = transformedPoints[i][j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }

    return new BoundingBox(min, max);
  }

  /**
   * Vérifie si un point est dans la boite englobante.
   * @param {number} x - Coordonnée x du point.
   * @param {number} y - Coordonnée y du point.
   * @param {number} z - Coordonnée z du point.
   * @return {boolean} Vrai si le point est dans la boite englobante.
   */
  isPointInside(x, y, z) {
    return (
      (x >= this.min[0] && x <= this.max[0]) &&
      (y >= this.min[1] && y <= this.max[1]) &&
      (z >= this.min[2] && z <= this.max[2])
    );
  }

  /**
   * Vérifie si la boite englobante rentre en intersection avec une autre boite englobante.
   * @param {BoundingBox} aabb - Autre boite englobante.
   * @return {boolean} Vrai si il y a intersection.
   */
  intersectBoundingBox(aabb) {
    return (
      (this.min[0] <= aabb.max[0] && this.max[0] >= aabb.min[0]) &&
      (this.min[1] <= aabb.max[1] && this.max[1] >= aabb.min[1]) &&
      (this.min[2] <= aabb.max[2] && this.max[2] >= aabb.min[2])
    );
  }
}

module.exports.BoundingBox = BoundingBox;