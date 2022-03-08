class SoundManager {
  constructor() {
    this.sounds = {};
  }

  async loadSound(path) {
    return new Promise(resolve => {
      this.sounds[path] = new Audio();
      this.sounds[path].src = path;
      this.sounds[path].addEventListener('canplaythrough', () => {
        resolve();
      });
    });
  }

  deleteSound(path) {
    if (!this.sounds[path]) {
      throw new Error('SoundManager::deleteSound(): The sound file doesn\'t exist, cannot delete !');
    }

    this.sounds[path].src = '';
    this.sounds[path] = null;
    delete this.sounds[path];
  }

  playSound(path) {
    if (!this.sounds[path]) {
      throw new Error('SoundManager::play(): The sound file doesn\'t exist, cannot play !');
    }

    this.sounds[path].play();
  }

  pauseSound(path) {
    this.sounds[path].pause();
  }

  releaseSounds() {
    for (let path in this.sounds) {
      this.sounds[path].src = '';
      this.sounds[path] = null;
      delete this.sounds[path];
    }
  }
}

module.exports.soundManager = new SoundManager();