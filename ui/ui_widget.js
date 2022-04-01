let { inputManager } = require('../input/input_manager');
let { eventManager } = require('../event/event_manager');

/**
 * Classe représentant un élément d'interface utilisateur.
 */
class UIWidget {
  /**
   * Créer un élément d'interface utilisateur.
   */
  constructor(options = {}) {
    this.id = '';
    this.focused = false;
    this.className = options.className != undefined ? options.className : '';
    this.template = options.template != undefined ? options.template : '';
    this.node = document.createElement('div');
    this.node.className = this.className;
    this.node.innerHTML = this.template;
  }

  /**
   * Fonction de mise à jour.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
  update(ts) {
    // virtual method called during update phase !
  }

  /**
   * Destructeur.
   * Nota bene: Entraine la désinscription des évènements utilisateur et détache le noeud HTML de son parent.
   */
  delete() {
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN', this);
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN_ONCE', this);
    this.node.remove();
    this.node = null;
  }

  /**
   * Définit un identifiant.
   * @param {string} id - L'Identifiant.
   */
  setId(id) {
    this.id = id;
  }

  /**
   * Donne le focus.
   * Nota bene: Souscription aux évènements utilisateur et ajout de la classe 'focused'.
   */
  focus() {
    eventManager.subscribe(inputManager, 'E_KEYDOWN', this, this.onKeyDown);
    eventManager.subscribe(inputManager, 'E_KEYDOWN_ONCE', this, this.onKeyDownOnce);
    this.node.classList.add('focused');
    this.focused = true;
    eventManager.emit(this, 'E_FOCUSED');
  }

  /**
   * Enlève le focus.
   * Nota bene: Désinscription aux évènements utilisateur et suppréssion de la classe 'focused'.
   */
  unfocus() {
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN', this);
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN_ONCE', this);
    this.node.classList.remove('focused');
    this.focused = false;
    eventManager.emit(this, 'E_UNFOCUSED');
  }

  /**
   * Rends le widget visible.
   */
  show() {
    this.node.classList.remove('u-hidden');
  }

  /**
   * Rends le widget invisible.
   */
  hide() {
    this.node.classList.add('u-hidden');
  }

  /**
   * Vérifie si le widget est visible.
   * @return {boolean} Vrai si le widget est visible.
   */
  isShow() {
    return this.node.classList.contains('u-hidden') == false;
  }

  /**
   * Fonction appelée lorsque le widget est "focus" et qu'une touche est appuyée.
   */
  onKeyDown(data) {
    // virtual method called during keydown event !
  }

  /**
   * Fonction appelée lorsque le widget est "focus" et qu'une touche est appuyée ponctuellement.
   */
  onKeyDownOnce(data) {
    // virtual method called during keydown once event !
  }
}

module.exports.UIWidget = UIWidget;