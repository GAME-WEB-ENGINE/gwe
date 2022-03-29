/**
 * Classe représentant un appui clavier.
 */
class KeydownEvent {
  constructor(key) {
    this.key = key;
  }
}

/**
 * Classe représentant un appui clavier ponctuel.
 */
class KeydownOnceEvent {
  constructor(key) {
    this.key = key;
  }
}

/**
 * Classe représentant un relachement clavier.
 */
class KeyupEvent {
  constructor(key) {
    this.key = key;
  }
}

/**
 * Classe représentant un appui souris.
 */
class MouseButtonDownEvent {
  constructor(button, position) {
    this.button = button;
    this.position = position;
  }
}

/**
 * Classe représentant un relachement souris.
 */
class MouseButtonUpEvent {
  constructor(button, position) {
    this.button = button;
    this.position = position;
  }
}

/**
 * Classe représentant le debut d'un mouvement avec appui de la souris.
 */
class MouseDragBeginEvent {
  constructor(button, position) {
    this.button = button;
    this.position = position;
  }
}

/**
 * Classe représentant un mouvement avec appui de la souris.
 */
class MouseDragEvent {
  constructor(button, position) {
    this.button = button;
    this.position = position;
  }
}

/**
 * Classe représentant la fin d'un mouvement avec appui de la souris.
 */
class MouseDragEndEvent {
  constructor(button, position) {
    this.button = button;
    this.position = position;
  }
}

/**
 * Classe représentant un mouvement de la souris.
 */
class MouseMoveEvent {
  constructor(position) {
    this.position = position;
  }
}

module.exports.KeydownEvent = KeydownEvent;
module.exports.KeydownOnceEvent = KeydownOnceEvent;
module.exports.KeyupEvent = KeyupEvent;
module.exports.MouseButtonDownEvent = MouseButtonDownEvent;
module.exports.MouseButtonUpEvent = MouseButtonUpEvent;
module.exports.MouseDragBeginEvent = MouseDragBeginEvent;
module.exports.MouseDragEvent = MouseDragEvent;
module.exports.MouseDragEndEvent = MouseDragEndEvent;
module.exports.MouseMoveEvent = MouseMoveEvent;