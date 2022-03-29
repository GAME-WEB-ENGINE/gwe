let { eventManager } = require('../event/event_manager');

/**
 * Classe représentant une collection d'éléments.
 * @extends Array
 */
class ArrayCollection extends Array {
  /**
   * Créer une collection.
   * @param {number} length - La taille d'origine de la collection.
   */
  constructor(length = 0) {
    super(length);
  }

  /**
   * Ajoute un élément à la fin du tableau.
   * @param {*} item - L'élément à ajouter.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_ADDED" est emit.
   * @return {number} La nouvelle taille du tableau.
   */
  push(item, emit = false) {
    let length = super.push(item);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_ADDED', { item: item, index: super.indexOf(item) });
    }

    return length;
  }

  /**
   * Retire un élément à la fin du tableau.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   * @return {*} L'élèment supprimé.
   */
  pop(emit = false) {
    let item = super.pop();
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { item: item, index: super.length });
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
    let index = super.indexOf(item);
    super.splice(index, 1);
    if (emit) {
      eventManager.emit(this, 'E_ITEM_REMOVED', { item: item, index: index });
    }

    return index;
  }

  /**
   * Supprime les éléments qui valident le prédicat.
   * @param {function} predicate - La fonction à évaluer pour chaque élement.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   */
  removeIf(predicate, emit = false) {
    for (let item of this) {
      if (predicate(item)) {
        this.remove(item, emit);
      }
    }
  }

  /**
   * Supprime le premier élément qui valide le prédicat.
   * @param {function} predicate - La fonction à évaluer pour chaque élement.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   * @return {number} L'élèment supprimé.
   */
  removeFirstIf(predicate, emit = false) {
    for (let item of this) {
      if (predicate(item)) {
        return this.remove(item, emit);
      }
    }
  }

  /**
   * Supprime l'élèment à l'index donné.
   * @param {number} index - Index de l'élèment.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   * @return {*} L'élèment supprimé.
   */
  removeAt(index, emit = false) {
    let item = super.splice(index, 1);
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
    return this.indexOf(item) != -1;
  }

  /**
   * Vérifie si les élèments sont dans le tableau.
   * @param {array} items - Les élèments à vérifier.
   * @return {boolean} Retourne vrai si les élèment sont dans la tableau.
   */
  contains(items) {
    for (let item of items) {
      if (this.indexOf(item) == -1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Vide le tableau.
   * @param {boolean} emit - Si vrai, l'évènement "E_ITEM_REMOVED" est emit.
   */
  clear(emit = false) {
    while (this.length) {
      this.pop(emit);
    }
  }
}

module.exports.ArrayCollection = ArrayCollection;