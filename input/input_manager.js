let { eventManager } = require('../event/event_manager');
let { KeydownEvent, KeydownOnceEvent, KeyupEvent, MouseButtonDownEvent, MouseButtonUpEvent, MouseDragBeginEvent, MouseDragEvent, MouseDragEndEvent, MouseMoveEvent } = require('./input_events');

/**
 * Singleton représentant un gestionnaire d'entrée utilisateur.
 */
class InputManager {
  /**
   * Créer un gestionnaire d'entrée utilisateur.
   */
  constructor() {
    this.keymap = {};
    this.eventQueue = [];
    this.keyPressed = false;
    this.mouseDown = false;
    this.mouseDrag = false;    
    this.handleKeyDownCb = null;
    this.handleKeyUpCb = null;
    this.handleMouseDownCb = null;
    this.handleMouseMoveCb = null;
    this.handleMouseUpCb = null;

    this.handleKeyDownCb = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDownCb);

    this.handleKeyUpCb = this.handleKeyUp.bind(this);
    document.addEventListener('keyup', this.handleKeyUpCb);

    this.handleMouseDownCb = this.handleMouseDown.bind(this);
    document.addEventListener('mousedown', this.handleMouseDownCb);

    this.handleMouseMoveCb = this.handleMouseMove.bind(this);
    document.addEventListener('mousemove', this.handleMouseMoveCb);

    this.handleMouseUpCb = this.handleMouseUp.bind(this);
    document.addEventListener('mouseup', this.handleMouseUpCb);
  }

  /**
   * Retourne et supprime le premier évènement de la file.
   * @return {InputEvent} Premier évènement de la file.
   */
  pullEvents() {
    return this.eventQueue.shift();
  }

  /**
   * Vérifie si la touche {key} est enfoncée.
   * @param {string} key - La touche à vérifier.
   * @return {boolean} Vrai si la touche est enfoncée.
   */
  isKeyDown(key) {
    return this.keymap[key];
  }

  /**
   * Vérifie si une touche est enfoncée.
   * @return {boolean} Vrai si une touche est enfoncée.
   */
  isKeyPressed() {
    return this.keyPressed;
  }

  handleKeyDown(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!this.keymap[e.which]) {
      this.eventQueue.push(new KeydownOnceEvent(e.which));
      eventManager.emit(this, 'E_KEYDOWN_ONCE', { key: e.which });
    }

    this.keyPressed = true;
    this.keymap[e.which] = true;
    this.eventQueue.push(new KeydownEvent(e.which));
    eventManager.emit(this, 'E_KEYDOWN', { key: e.which });
  }

  handleKeyUp(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    this.keyPressed = false;
    this.keymap[e.which] = false;
    this.eventQueue.push(new KeyupEvent(e.which));
    eventManager.emit(this, 'E_KEYUP', { key: e.which });
  }

  handleMouseDown(e) {
    this.mouseDown = true;
    this.eventQueue.push(new MouseButtonDownEvent(e.button, [e.clientX, e.clientY]));
    eventManager.emit(this, 'E_MOUSEBUTTONDOWN', { button: e.button, position: [e.clientX, e.clientY] });
  }

  handleMouseMove(e) {
    if (this.mouseDown) {
      if (!this.mouseDrag) {
        this.mouseDrag = true;
        this.eventQueue.push(new MouseDragBeginEvent(e.button, [e.clientX, e.clientY]));
        eventManager.emit(this, 'E_MOUSEDRAG_BEGIN', { button: e.button,  position: [e.clientX, e.clientY] });        
      }
      else {
        this.eventQueue.push(new MouseDragEvent(e.button, [e.clientX, e.clientY]));
        eventManager.emit(this, 'E_MOUSEDRAG', { button: e.button, position: [e.clientX, e.clientY] });
      }
    }

    this.eventQueue.push(new MouseMoveEvent([e.clientX, e.clientY]));
    eventManager.emit(this, 'E_MOUSEMOVE', { position: [e.clientX, e.clientY] });
  }

  handleMouseUp(e) {
    if (this.mouseDrag) {
      this.mouseDrag = false;
      this.eventQueue.push(new MouseButtonUpEvent(e.button, [e.clientX, e.clientY]));
      eventManager.emit(this, 'E_MOUSEDRAG_END', { button: e.button, position: [e.clientX, e.clientY] });
    }

    this.mouseDown = false;
    this.eventQueue.push(new MouseButtonUpEvent(e.button, [e.clientX, e.clientY]));
    eventManager.emit(this, 'E_MOUSEBUTTONUP', { button: e.button, position: [e.clientX, e.clientY] });
  }
}

module.exports.inputManager = new InputManager();