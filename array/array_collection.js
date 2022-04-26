let { eventManager } = require('../event/event_manager');

/**
 * Classe représentant une collection d'éléments.
 */
class ArrayCollection {
  /**
   * Créer une collection.
   * @param {array} items - Le tableau lié à la collection.
   */
  constructor(items = []) {
    this.items = items;
  }

  /**
   * Récupère le talbleau lié.
   * @return {array} La tableau lié.
   */
  getItems() {
    return this.items;
  }

  /**
   * Ajoute un élément à la fin du tableau.
   * @param {*} item - L'élément à ajouter.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_ADDED" est emit.
   * @return {number} La nouvelle taille du tableau.
   */
  push(item, emit = false) {
    let length = this.items.push(item);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_ADDED', { item: item, index: this.items.indexOf(item) });
    }

    return length;
  }

  /**
   * Retire un élément à la fin du tableau.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   * @return {*} L'élèment supprimé.
   */
  pop(emit = false) {
    let item = this.items.pop();
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { item: item, index: this.items.length });
    }

    return item;
  }

  /**
   * Supprime un élément.
   * @param {*} item - L'élément à supprimer.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   * @return {number} L'index de l'élèment supprimé.
   */
  remove(item, emit = false) {
    let index = this.items.indexOf(item);
    this.items.splice(index, 1);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { item: item, index: index });
    }

    return index;
  }

  /**
   * Supprime l'élèment à l'index donné.
   * @param {number} index - Index de l'élèment.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   * @return {*} L'élèment supprimé.
   */
  removeAt(index, emit = false) {
    let item = this.items.splice(index, 1);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { item: item, index: index });
    }

    return item;
  }

  /**
   * Vérifie si l'élèment est dans le tableau.
   * @param {*} item - L'élèment à vérifier.
   * @return {boolean} Retourne vrai si l'élèment est dans la tableau.
   */
  has(item) {
    return this.items.indexOf(item) != -1;
  }

  /**
   * Vide le tableau.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   */
  clear(emit = false) {
    while (this.items.length) {
      this.items.pop(emit);
    }
  }
}

module.exports.ArrayCollection = ArrayCollection;