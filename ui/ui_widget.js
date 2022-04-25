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
    this.className = options.className != undefined ? options.className : '';
    this.template = options.template != undefined ? options.template : '';
    this.node = document.createElement('div');
    this.node.className = this.className;
    this.node.innerHTML = this.template;

    this.node.addEventListener('animationend', () => eventManager.emit(this, 'E_ANIMATION_FINISHED'));
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
   * Retourne l'identifiant.
   * @return {string} L'Identifiant.
   */
  getId() {
    return this.id;
  }

  /**
   * Définit l'identifiant.
   * @param {string} id - L'Identifiant.
   */
  setId(id) {
    this.id = id;
  }

  /**
   * Vérifie si le widget est focus.
   * @return {boolean} Vrai si le widget est focus.
   */
  isFocused() {
    return this.node.classList.contains('u-focused') == true;
  }

  /**
   * Donne le focus.
   * Nota bene: Souscription aux évènements utilisateur et ajout de la classe 'u-focused'.
   */
  focus() {
    eventManager.subscribe(inputManager, 'E_KEYDOWN', this, this.onKeyDown);
    eventManager.subscribe(inputManager, 'E_KEYDOWN_ONCE', this, this.onKeyDownOnce);
    this.node.classList.add('u-focused');
    eventManager.emit(this, 'E_FOCUSED');
  }

  /**
   * Enlève le focus.
   * Nota bene: Désinscription aux évènements utilisateur et suppréssion de la classe 'u-focused'.
   */
  unfocus() {
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN', this);
    eventManager.unsubscribe(inputManager, 'E_KEYDOWN_ONCE', this);
    this.node.classList.remove('u-focused');
    eventManager.emit(this, 'E_UNFOCUSED');
  }

  /**
   * Vérifie si le widget est visible.
   * @return {boolean} Vrai si le widget est visible.
   */
  isShow() {
    return this.node.classList.contains('u-hidden') == false;
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
   * Vérifie si le widget est activé.
   * @return {boolean} Vrai si le widget est activé.
   */
  isEnabled() {
    return this.node.classList.contains('u-disabled') == false;
  }

  /**
   * Définit l'activation.
   * Nota bene: Ajoute la classe 'u-disabled'.
   * @param {boolean} enabled - Si vrai, le widget est activé.
   */
  setEnabled(enabled) {
    if (enabled) {
      this.node.classList.remove('u-disabled');
    }
    else {
      this.node.classList.add('u-disabled');
    }
  }

  /**
   * Vérifie si le widget est selectionné.
   * @return {boolean} Vrai si le widget est selectionné.
   */
  isSelected() {
    return this.node.classList.contains('u-selected') == true;
  }

  /**
   * Définit la selection.
   * Nota bene: Ajoute la classe 'u-selected'.
   * @param {boolean} selected - Si vrai, le widget est selectionné.
   */
  setSelected(selected) {
    if (selected) {
      this.node.classList.add('u-selected');
    }
    else {
      this.node.classList.remove('u-selected');
    }
  }

  /**
   * Applique une animation css.
   * @param {string} animation - Description de l'animation.
   */
  animate(animation) {
    this.node.style.animation = animation;
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