/**
 * Classe représentant la position et la taille d'un rectangle de rendu.
 */
class GfxViewport {
  constructor() {
    this.xFactor = 0;
    this.yFactor = 0;
    this.widthFactor = 1;
    this.heightFactor = 1;
  }
}

module.exports.GfxViewport = GfxViewport;