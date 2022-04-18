//
// @todo: Optimiser getElevationAt(); vérifier uniquement les secteurs voisins
//

let fs = require('fs');
let { Utils } = require('../helpers');
let { GfxDrawable } = require('./gfx_drawable');
let { gfxManager } = require('./gfx_manager');

class JWM {
  constructor() {
    this.vertices = [];
    this.sectors = [];
  }
}

class JWMSector {
  constructor() {
    this.id = '';
    this.vertices = [];
  }

  getWeightsAt(x, z) {
    let f = [x, 0, z];
    let a = this.vertices[0];
    let b = this.vertices[1];
    let c = this.vertices[2];

    let vecteurAB = [b[0] - a[0], 0, b[2] - a[2]];
    let vecteurAC = [c[0] - a[0], 0, c[2] - a[2]];
    let vecteurFA = [a[0] - f[0], 0, a[2] - f[2]];
    let vecteurFB = [b[0] - f[0], 0, b[2] - f[2]];
    let vecteurFC = [c[0] - f[0], 0, c[2] - f[2]];
    let area = Utils.VEC3_LENGTH(Utils.VEC3_CROSS(vecteurAB, vecteurAC));

    let wa = Utils.VEC3_LENGTH(Utils.VEC3_CROSS(vecteurFB, vecteurFC)) / area;
    let wb = Utils.VEC3_LENGTH(Utils.VEC3_CROSS(vecteurFA, vecteurFC)) / area;
    let wc = Utils.VEC3_LENGTH(Utils.VEC3_CROSS(vecteurFA, vecteurFB)) / area;

    if ((Math.round((wa + wb + wc) * 1e2) / 1e2) > 1) {
      wa = -1; wb = -1; wc = -1;
    }

    return { wa, wb, wc };
  }

  getElevationAt(x, z) {
    let a = this.vertices[0];
    let b = this.vertices[1];
    let c = this.vertices[2];

    let weights = this.getWeightsAt(x, z);
    if (weights.wa == -1 || weights.wb == -1 || weights.wc == -1) return Infinity;

    // pour finir, nous déterminons la coordonnée 'y' grâce aux poids precedemment trouvés.
    // celà est possible car : wa*HA + wb*HB = 0 et wa+wb*GH + wc*GC = 0.
    let vert = a[1] + ((b[1] - a[1]) * (weights.wb / (weights.wa + weights.wb)));
    let elev = vert + ((c[1] - vert) * (weights.wc / (weights.wa + weights.wb + weights.wc)));

    return elev;
  }
}

/**
 * Classe représentant un mesh de navigation (alias walkmesh).
 * @extends GfxDrawable
 */
class GfxJWMDrawable extends GfxDrawable {
  /**
   * Créer un mesh de navigation.
   */
  constructor() {
    super();
    this.jwm = new JWM();
  }

  /**
   * Fonction de dessin.
   * @param {number} viewIndex - Index de la vue en cours.
   */
  draw(viewIndex) {
    gfxManager.drawDebugLines(this.getModelMatrix(), this.vertexCount, this.vertices, [1.0, 0.0, 0.5]);
  }

  /**
   * Charge un fichier "jwm".
   * @param {string} path - Le chemin du fichier.
   */
  loadFromFile(path) {
    let json = JSON.parse(fs.readFileSync(path));
    if (!json.hasOwnProperty('Ident') || json['Ident'] != 'JWM') {
      throw new Error('GfxJWMDrawable::loadFromFile(): File not valid !');
    }

    this.clearVertices();
    this.jwm = new JWM();

    for (let arr of json['Vertices']) {
      this.jwm.vertices.push([arr[0], arr[1], arr[2]]);
    }

    for (let obj of json['Sectors']) {
      let sector = new JWMSector();
      sector.id = obj['Id'];
      sector.vertices[0] = this.jwm.vertices[obj['VertexIndices'][0]];
      sector.vertices[1] = this.jwm.vertices[obj['VertexIndices'][1]];
      sector.vertices[2] = this.jwm.vertices[obj['VertexIndices'][2]];
      this.defineVertice(sector.vertices[0][0], sector.vertices[0][1], sector.vertices[0][2]);
      this.defineVertice(sector.vertices[1][0], sector.vertices[1][1], sector.vertices[1][2]);
      this.defineVertice(sector.vertices[0][0], sector.vertices[0][1], sector.vertices[0][2]);
      this.defineVertice(sector.vertices[2][0], sector.vertices[2][1], sector.vertices[2][2]);
      this.defineVertice(sector.vertices[1][0], sector.vertices[1][1], sector.vertices[1][2]);
      this.defineVertice(sector.vertices[2][0], sector.vertices[2][1], sector.vertices[2][2]);
      this.jwm.sectors.push(sector);
    }
  }

  /**
   * Retourne l'élévation en y pour la position x,z.
   * Note: Si cette élévation est égale à l'infinie alors le x,z est en dehors du mesh de navigation.
   * @return {number} L'élévation en y.
   */
  getElevationAt(x, z) {
    for (let sector of this.jwm.sectors) {
      let minX = Math.min(sector.vertices[0][0], sector.vertices[1][0], sector.vertices[2][0]);
      let minZ = Math.min(sector.vertices[0][2], sector.vertices[1][2], sector.vertices[2][2]);
      let maxX = Math.max(sector.vertices[0][0], sector.vertices[1][0], sector.vertices[2][0]);
      let maxZ = Math.max(sector.vertices[0][2], sector.vertices[1][2], sector.vertices[2][2]);
      if (x < minX || x > maxX || z < minZ || z > maxZ) {
        continue;
      }

      let elevation = sector.getElevationAt(x, z);
      if (elevation != Infinity) {
        return elevation;
      }
    }

    return Infinity;
  }
}

module.exports.GfxJWMDrawable = GfxJWMDrawable;