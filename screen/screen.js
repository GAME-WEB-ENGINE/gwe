/**
 * Classe représentant un écran.
 */
class Screen {
  /**
   * Créer un écran.
   */
  constructor(app) {
    this.app = app;
    this.blocking = true;
  }

  /**
   * Définit l'interrupteur de bloquage.
   * Nota bene: Si un écran est bloquant, celui-ci va stopper la répartition descendante.
   * @param {boolean} blocking - Interrupteur de bloquage.
   */
  setBlocking(blocking) {
    this.blocking = blocking;
  }

  /**
   * Fonction appelée lors de la phase d'évènements d'entrées utilisateur.
   * @param {InputEvent} event - Evènement d'entrée utilisateur.
   */
   handleEvent(event) {
    // virtual method called during event pulling phase !
  }

  /**
   * Fonction de mise à jour.
   * @param {number} ts - Temps passé depuis la dernière mise à jour.
   */
  update(ts) {
    // virtual method called during update phase !
  }

  /**
   * Fonction de dessin.
   * @param {number} viewIndex - Index de la vue en cours.
   */
  draw(viewIndex) {
    // virtual method called during draw phase !
  }

  /**
   * Fonction appelée lors de l'ajout de l'écran dans le gestionnaire.
   * @param {object} args - Données transitoires.
   */
  onEnter(args) {
    // virtual method called during enter phase !
  }

  /**
   * Fonction appelée lors de la suppression de l'écran dans le gestionnaire.
   * @param {object} args - Données transitoires.
   */
  onExit() {
    // virtual method called during exit phase !
  }

  /**
   * Fonction appelée lorsque l'écran entre en dernière position dans le gestionnaire.
   */
  onBringToFront() {
    // virtual method called when get the top state level !
  }

  /**
   * Fonction appelée lorsque l'écran quitte la dernière position dans le gestionnaire.
   */
  onBringToBack() {
    // virtual method called when lost the top state level !
  }
}

module.exports.Screen = Screen;
