let { Texture } = require('./texture');
let { gfxManager } = require('../gfx/gfx_manager');

/**
 * Singleton représentant un gestionnaire de ressources texture.
 */
class TextureManager {
  /**
   * Créer un gestionnaire de ressources texture.
   */
  constructor() {
    this.gl = gfxManager.getGLContext();
    this.textures = {};
    this.defaultTexture = new Texture();

    this.defaultTexture.glt = this.gl.createTexture();
    this.defaultTexture.width = 1;
    this.defaultTexture.height = 1;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.defaultTexture.glt);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.defaultTexture.width, this.defaultTexture.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  }

  /**
   * Charge une nouvelle ressource de façon asynchrone.
   * @param {string} path - Le chemin du fichier texture.
   * @return {Promise} Promesse resolue lors du chargement du fichier en mémoire.
   */
  async loadTexture(path) {
    return new Promise(resolve => {
      if (this.getTexture(path) != this.defaultTexture) {
        return resolve();
      }

      let image = new Image();
      image.src = path;

      image.addEventListener('load', () => {
        let texture = new Texture();
        texture.glt = this.gl.createTexture();
        texture.width = image.width;
        texture.height = image.height;
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.glt);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

        let ext = this.gl.getExtension('EXT_texture_filter_anisotropic');
        if (ext) {
          let max = this.gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
          this.gl.texParameterf(this.gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }

        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.textures[path] = texture;
        resolve();
      });
    });
  }

  /**
   * Supprime la ressource.
   * @param {string} path - Le chemin du fichier texture.
   */
  deleteTexture(path) {
    if (!this.textures[path]) {
      throw new Error('TextureManager::deleteTexture(): The texture file doesn\'t exist, cannot delete !');
    }

    this.textures[path] = null;
    delete this.textures[path];
  }

  /**
   * Récupère la ressource.
   * Si celle-ci n'est pas pré-chargée c'est alors la texture par default qui est retournée.
   * @param {string} path - Le chemin du fichier de texture.
   * @return {Texture} La texture.
   */
  getTexture(path) {
    return this.textures[path] ? this.textures[path] : this.defaultTexture;
  }

  /**
   * Supprime toutes les ressources du gestionnaire.
   */
  releaseTextures() {
    for (let path in this.textures) {
      this.textures[path] = null;
      delete this.textures[path];
    }
  }
}

module.exports.textureManager = new TextureManager();