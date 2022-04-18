let { Utils } = require('../helpers');
let { GfxDrawable } = require('./gfx_drawable');
let { gfxManager } = require('./gfx_manager');
let { eventManager } = require('../event/event_manager');

/**
 * Classe représentant un chemin de fer.
 * Attention: Cet objet n'est pas affecté par les transformations.
 * Permet à un objet rattaché de se déplacer sur le chemin définit par le tableau de points.
 * @extends GfxDrawable
 */
class GfxMover extends GfxDrawable {
  /**
   * Créer un chemin de fer.
   */
  constructor() {
    super();
    this.points = [];
    this.speed = 1;
    this.drawable = null;
    this.currentPointIndex = 1;
    this.playing = false;
    this.looped = false;
  }

  /**
   * Fonction de mise à jour.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
  update(ts) {
    if (this.points.length < 2) {
      return;
    }
    if (!this.drawable) {
      return;
    }
    if (!this.playing) {
      return;
    }

    let position = this.drawable.getPosition();
    let delta = Utils.VEC3_SUBSTRACT(this.points[this.currentPointIndex], position);
    let direction = Utils.VEC3_NORMALIZE(delta);
    let nextPosition = Utils.VEC3_ADD(position, Utils.VEC3_SCALE(direction, this.speed * (ts / 1000)));

    this.drawable.setPosition(nextPosition);
    this.drawable.setRotation([0, Utils.VEC2_ANGLE([direction[0], direction[2]]), 0]);

    if (Utils.VEC3_LENGTH(delta) < 0.1) {
      if (this.currentPointIndex == this.points.length - 1) {
        this.currentPointIndex = this.looped ? 1 : this.points.length - 1;
        this.playing = this.looped;
        eventManager.emit(this, 'E_FINISHED');
      }
      else {
        this.currentPointIndex = this.currentPointIndex + 1;
      }
    }
  }

  /**
   * Fonction de dessin.
   * @param {number} viewIndex - Index de la vue en cours.
   */
  draw() {
    gfxManager.drawDebugLines(Utils.MAT4_IDENTITY(), this.vertexCount, this.vertices, [0.0, 1.0, 0.0]);
  }

  /**
   * Retourne les points du chemin de fer.
   * @return {array} Un tableau de points représentant le chemin à parcourir (tableau à deux dimensions).
   */
  getPoints() {
    return this.points;
  }

  /**
   * Définit les points du chemin de fer.
   * Dans le cas ou le dernier point est strictement identique au premier alors le mouvement est une boucle infinie.
   * @param {array} points - Un tableau de points représentant le chemin à parcourir (tableau à deux dimensions).
   */
  setPoints(points) {
    this.clearVertices();
    this.clearNormals();
    this.clearTextureCoords();

    for (let i = 0; i < points.length - 1; i++) {
      this.defineVertice(points[i][0], points[i][1], points[i][2]);
      this.defineVertice(points[i + 1][0], points[i + 1][1], points[i + 1][2]);
    }

    if (Utils.VEC3_ISEQUAL(points[points.length - 1], points[0])) {
      this.looped = true;
    }

    this.points = points;
  }

  /**
   * Retourne la vitesse de déplacement de l'objet en mouvement.
   * @return {number} La vitesse de déplacement.
   */
  getSpeed() {
    return this.speed;
  }

  /**
   * Définit la vitesse de déplacement de l'objet en mouvement.
   * @param {number} speed - La vitesse de déplacement.
   */
  setSpeed(speed) {
    this.speed = speed;
  }

  /**
   * Retourne l'objet en mouvement.
   * @return {GfxDrawable} L'objet en mouvement.
   */
  getDrawable() {
    return this.drawable;
  }

  /**
   * Définit l'objet en mouvement.
   * @param {GfxDrawable} drawable - L'objet en mouvement.
   */
  setDrawable(drawable) {
    this.drawable = drawable;
  }

  /**
   * Vérifie si l'objet est en mouvement.
   * @return {boolean} Si vrai, l'objet est en mouvement.
   */
  isPlaying() {
    return this.isPlaying;
  }

  /**
   * Définit si l'objet est en mouvement.
   * @param {boolean} playing - Si vrai, l'objet est en mouvement sinon il est en pause.
   */
  setPlaying(playing) {
    this.playing = playing;
  }

  /**
   * Joue le mouvement.
   */
  play() {
    if (this.points.length < 2) {
      throw new Error('GfxMover::play: points is not defined.');
    }
    if (!this.drawable) {
      throw new Error('GfxMover::play: drawable is not defined.');
    }

    this.drawable.setPosition(this.points[0]);
    this.currentPointIndex = 1;
    this.playing = true;
  }
}

module.exports.GfxMover = GfxMover;