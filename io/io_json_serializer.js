let fs = require('fs');

/**
 * Classe représentant un outil de serialization JSON.
 */
class IOJSONSerializer {
  /**
   * Charge un fichier JSON et désérialize le contenu dans un objet serializable.
   * @param {object} object - Objet serializable (doit contenir fromJSON et toJSON).
   * @param {string} path - Chemin du fichier JSON.
   */
  static fromFile(object, path) {
    let json = JSON.parse(fs.readFileSync(path));
    IOJSONSerializer.fromJSON(object, json);
  }

  /**
   * Charge un fichier JSON et désérialize le contenu dans un objet serializable.
   * @param {object} object - Objet serializable (doit contenir fromJSON et toJSON).
   * @param {string} path - Chemin du fichier JSON.
   */
  static toFile(object, path) {
    // à écrire.
  }

  /**
   * Déserialize une chaine JSON dans un objet serializable.
   * @param {object} object - Objet serializable (doit contenir fromJSON).
   * @return {boolean} Vrai si la déserialization réussie.
   */
  static fromJSON(object, json) {
    return object.fromJSON(json);
  }

  /**
   * Sérialize un objet serializable dans une chaine JSON.
   * @param {object} object - Objet serializable (doit contenir toJSON).
   * @return {string} La chaine JSON.
   */
  static toJSON(object) {
    return object.toJSON();
  }
}

module.exports.IOJSONSerializer = IOJSONSerializer;