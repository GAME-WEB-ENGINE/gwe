/**
 * Singleton représentant un gestionnaire d'écrans.
 */
class ScreenManager {
  /**
   * Créer un gestionnaire d'écrans.
   */
  constructor() {
    this.requests = [];
    this.stack = [];
  }

  /**
   * Répartition des entrées utilisateur à tous les écrans.
   * Nota bene: Si un écran est bloquant, celui-ci va stopper la répartition descendante.
   * @param {InputEvent} event - Evènement d'entrée utilisateur.
   */
  handleEvent(event) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack[i].handleEvent(event);
      if (this.stack[i].blocking) {
        return;
      }
    }
  }

  /**
   * Répartition de la mise à jour à tous les écrans.
   * Nota bene: Si un écran est bloquant, celui-ci va stopper la répartition descendante.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
  update(ts) {
    while (this.requests.length > 0) {
      let request = this.requests.pop();
      request();
    }

    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack[i].update(ts);
      if (this.stack[i].blocking) {
        return;
      }
    }
  }

  /**
   * Répartition du rafraichissement graphique à tous les écrans.
   * Nota bene: Si un écran est bloquant, celui-ci va stopper la répartition descendante.
   * @param {number} viewIndex - Index de la vue en cours.
   */
  draw(viewIndex) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack[i].draw(viewIndex);
      if (this.stack[i].blocking) {
        return;
      }
    }
  }

  /**
   * Commande l'ajout d'un écran.
   * @param {Screen} newTopScreen - Ecran à ajouter.
   * @param {object} args - Données transitoires.
   */
  requestPushScreen(newTopScreen, args = {}) {
    this.requests.push(() => {
      if (this.stack.indexOf(newTopScreen) != -1) {
        throw new Error('ScreenManager::requestPushScreen(): You try to push an existing screen to the stack !');
      }

      let topScreen = this.stack[this.stack.length - 1];
      topScreen.onBringToBack(newTopScreen);

      newTopScreen.onEnter(args);
      this.stack.push(newTopScreen);
    });
  }

  /**
   * Commande l'ajout d'un écran et supprime tous les écrans courants.
   * @param {Screen} newScreen - Ecran à ajouter.
   * @param {object} args - Données transitoires.
   */
  requestSetScreen(newScreen, args = {}) {
    this.requests.push(() => {
      this.stack.forEach((screen) => screen.onExit());
      this.stack = [];
      newScreen.onEnter(args);
      this.stack.push(newScreen);
    });
  }

  /**
   * Commande la suppression du dernier écran.
   */
  requestPopScreen() {
    this.requests.push(() => {
      if (this.stack.length == 0) {
        throw new Error('ScreenManager::requestPopScreen: You try to pop an empty state stack !');
      }

      let topScreen = this.stack[this.stack.length - 1];
      topScreen.onExit();
      this.stack.pop();

      if (this.stack.length > 0) {
        let newTopScreen = this.stack[this.stack.length - 1];
        newTopScreen.onBringToFront(topScreen);
      }
    });
  }
}

module.exports.screenManager = new ScreenManager();