/**
 * Singleton représentant un gestionnaire de ressources son.
 */
class SoundManager {
  /**
   * Créer un gestionnaire de ressources son.
   */
  constructor() {
    this.sounds = {};
  }

  /**
   * Charge une nouvelle ressource de façon asynchrone.
   * @param {string} path - Le chemin du fichier son.
   * @return {Promise} Promesse resolue lors du chargement du fichier en mémoire.
   */
  async loadSound(path) {
    return new Promise(resolve => {
      this.sounds[path] = new Audio();
      this.sounds[path].src = path;
      this.sounds[path].addEventListener('canplaythrough', () => {
        resolve();
      });
    });
  }

  /**
   * Supprime la ressource.
   * @param {string} path - Le chemin du fichier son.
   */
  deleteSound(path) {
    if (!this.sounds[path]) {
      throw new Error('SoundManager::deleteSound(): The sound file doesn\'t exist, cannot delete !');
    }

    this.sounds[path].src = '';
    this.sounds[path] = null;
    delete this.sounds[path];
  }

  /**
   * Joue la ressource.
   * @param {string} path - Le chemin du fichier son.
   */
  playSound(path) {
    if (!this.sounds[path]) {
      throw new Error('SoundManager::play(): The sound file doesn\'t exist, cannot play !');
    }

    this.sounds[path].play();
  }

  /**
   * Met en pause la ressource.
   * @param {string} path - Le chemin du fichier son.
   */
  pauseSound(path) {
    this.sounds[path].pause();
  }

  /**
   * Supprime toutes les ressources du gestionnaire.
   */
  releaseSounds() {
    for (let path in this.sounds) {
      this.sounds[path].src = '';
      this.sounds[path] = null;
      delete this.sounds[path];
    }
  }
}

module.exports.soundManager = new SoundManager();