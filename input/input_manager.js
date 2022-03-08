let { eventManager } = require('../event/event_manager');

class InputManager {
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

  pullEvents() {
    return this.eventQueue.shift();
  }

  isKeyDown(key) {
    return this.keymap[key];
  }

  isKeyPressed() {
    return this.keyPressed;
  }

  handleKeyDown(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!this.keyPressed) {
      this.eventQueue.push({ type: 'KEYDOWN_ONCE', key: e.which });
      eventManager.emit(this, 'E_KEYDOWN_ONCE', { key: e.which });
    }

    this.keyPressed = true;
    this.keymap[e.which] = true;
    this.eventQueue.push({ type: 'KEYDOWN', key: e.which });
    eventManager.emit(this, 'E_KEYDOWN', { key: e.which });
  }

  handleKeyUp(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    this.keyPressed = false;
    this.keymap[e.which] = false;
    this.eventQueue.push({ type: 'KEYUP', key: e.which });
    eventManager.emit(this, 'E_KEYUP', { key: e.which });
  }

  handleMouseDown(e) {
    this.mouseDown = true;
    this.eventQueue.push({ type: 'MOUSEBUTTONDOWN', position: [e.clientX, e.clientY] });
    eventManager.emit(this, 'E_MOUSEBUTTONDOWN', { position: [e.clientX, e.clientY] });
  }

  handleMouseMove(e) {
    if (this.mouseDown) {
      if (!this.mouseDrag) {
        this.mouseDrag = true;
        this.eventQueue.push({ type: 'MOUSEDRAG_BEGIN', position: [e.clientX, e.clientY] });
        eventManager.emit(this, 'E_MOUSEDRAG_BEGIN', { position: [e.clientX, e.clientY] });        
      }
      else {
        this.eventQueue.push({ type: 'MOUSEDRAG', position: [e.clientX, e.clientY] });
        eventManager.emit(this, 'E_MOUSEDRAG', { position: [e.clientX, e.clientY] });
      }
    }

    this.eventQueue.push({ type: 'MOUSEMOVE', position: [e.clientX, e.clientY] });
    eventManager.emit(this, 'E_MOUSEMOVE', { position: [e.clientX, e.clientY] });
  }

  handleMouseUp(e) {
    if (this.mouseDrag) {
      this.mouseDrag = false;
      this.eventQueue.push({ type: 'MOUSEDRAG_END', position: [e.clientX, e.clientY] });
      eventManager.emit(this, 'E_MOUSEDRAG_END', { position: [e.clientX, e.clientY] });
    }

    this.mouseDown = false;
    this.eventQueue.push({ type: 'MOUSEBUTTONUP', position: [e.clientX, e.clientY] });
    eventManager.emit(this, 'E_MOUSEBUTTONUP', { position: [e.clientX, e.clientY] });
  }
}

module.exports.inputManager = new InputManager();